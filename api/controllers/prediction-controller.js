const Boom = require('boom');
const Game = require('../models/game-model');
const Utils = require('./auth-controller');
const Score = require('../models/score-model');
const Prediction = require('../models/prediction-model');

exports.createOrUpdate = async request => {
  try {
    const player = await Utils.getPlayerIdFromRequest(request);
    const { tournament, game, team } = request.payload;
    const newWeighting = request.payload.weighting;
    const prediction = await Prediction.findOneAndUpdate(
      { player, game },
      { $set: { team, weighting: newWeighting } },
      {
        upsert: true,
        new: false // return false to provide old weighting to update scores
      }
    );
    const oldWeighting = prediction ? prediction.weighting : null;
    console.log(prediction, oldWeighting);
    if (oldWeighting) {
      await Score.findOneAndUpdate(
        { player, tournament },
        {
          $pull: { weightingsUsed: oldWeighting },
          $push: { weightingsRemaining: { $each: [oldWeighting], $sort: 1 } }
        }
      );
    }
    const scores = await Score.findOneAndUpdate(
      { player, tournament }, // find player scores for tournament
      {
        $pull: { weightingsRemaining: newWeighting },
        $push: { weightingsUsed: { $each: [newWeighting], $sort: 1 } }
      },
      { new: true }
    );
    console.log({ scores, prediction });
    return { scores, prediction };
  } catch (e) {
    return Boom.badImplementation(`error creating prediction: ${e}`);
  }
};

exports.retrieve = async request => {
  // retrieve all predictions for player in tournament
  try {
    const player = await Utils.getPlayerIdFromRequest(request);
    const { tournamentId } = request.url.query;
    return Prediction.find({ player, tournament: tournamentId }).sort({
      startTime: 1
    });
  } catch (e) {
    return Boom.badImplementation(`error finding predictions: ${e}`);
  }
};

exports.retrieveGamesWithPrediction = async request => {
  try {
    const player = await Utils.getPlayerIdFromRequest(request);
    const { tournament } = request.url.query;
    // find games for tournament
    const games = await Game.find({ tournament });
    // reduce to only ids
    const gameIds = games.map(game => game._id);
    // find predictions for tournament
    const predictions = await Prediction.find({ player, game: gameIds });
    // reduce to ids
    const gameIdsWithPredictions = predictions.map(
      prediction => prediction.game
    );
    // find games with predictions
    return Game.find({ _id: { $not: { $eq: gameIdsWithPredictions } } });
  } catch (e) {
    return Boom.badImplementation(`error finding predictions: ${e}`);
  }
};

exports.missed = async request => {
  // TODO
  // run at fixture start
  // remove weighting
  try {
    const { player, game } = request.payload;
    const scores = Score.find({ player });
    const weighting = Math.max(scores.weightingsRemaining);
    return new Prediction({
      player,
      game,
      weighting,
      correct: false
    }).save();
  } catch (e) {
    return Boom.badImplementation(`error creating missed prediction: ${e}`);
  }
};

exports.resolve = async request => {
  try {
    const { game } = request.payload;
    const finishedGame = Game.findOne({ game });
    await Prediction.findOneAndUpdate(
      { game, team: finishedGame.winner },
      { $set: { correct: true } }
    );
    await Prediction.findOneAndUpdate(
      { game, team: { $ne: finishedGame.winner } },
      { $set: { correct: false } }
    );
    return Prediction.find({ game });
  } catch (e) {
    return Boom.badImplementation(`error resolving prediction: ${e}`);
  }
};
