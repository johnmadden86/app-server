const Boom = require('boom');
const Utils = require('./auth-controller');
const Game = require('../models/game-model');
const Tournament = require('../models/tournament-model');
const Team = require('../models/team-model');
const Prediction = require('../models/prediction-model');
const Score = require('../models/score-model');
const Player = require('../models/player-model');

exports.create = async request => {
  try {
    return new Game(request.payload).save();
  } catch (e) {
    return Boom.badImplementation(`error creating game: ${e}`);
  }
};

exports.retrieveOne = async request => {
  try {
    return Game.findOne({ _id: request.params.id });
  } catch (e) {
    return Boom.badImplementation(`error getting game: ${e}`);
  }
};

exports.retrieve = async request => {
  const currentDate = new Date();
  const player = await Utils.getPlayerIdFromRequest(request);
  const { tournament, filter } = request.url.query;
  async function getGameIdsWithPredictions() {
    // find games for tournament
    const games = await Game.find({ tournament });
    // reduce to only ids
    const gameIds = games.map(game => game._id);
    // find predictions for tournament
    const predictions = await Prediction.find({ player, game: gameIds });
    // reduce to ids
    return predictions.map(prediction => prediction.game);
  }
  try {
    switch (filter) {
      case 'all':
        return Game.find({ tournament }).sort({ startTime: 1 }); // .populate('teams');

      case 'past':
        return Game.find({ tournament, finishTime: { $lt: currentDate } }).sort(
          {
            startTime: 1
          }
        );
      // .populate('teams');

      case 'future':
        return Game.find({
          tournament,
          startTime: { $gt: currentDate }
        }).sort({ startTime: 1 });
      // .populate('teams');

      case 'inPlay':
        return Game.find({
          tournament,
          startTime: { $lt: currentDate },
          finishTime: { $gt: currentDate }
        }).sort({ startTime: 1 }); // .populate('teams');

      case 'prediction': {
        // find games with predictions
        const gameIds = await getGameIdsWithPredictions();
        return Game.find({ _id: gameIds }).sort({
          startTime: 1
        }); // .populate('teams');
      }
      case 'noPrediction': {
        // find games without predictions
        const gameIds = await getGameIdsWithPredictions();
        return Game.find({
          _id: { $not: { $eq: gameIds } }
        }).sort({ startTime: 1 }); // .populate('teams');
      }
      default:
        // defaults to all
        return Game.find({ tournament }).sort({ startTime: 1 });
      // .populate('teams');
    }
  } catch (e) {
    return Boom.badImplementation(`error getting game: ${e}`);
  }
};

exports.retrieveAll = async () => {
  try {
    return Game.find({})
      .sort({ startTime: 1 })
      .populate('teams');
  } catch (e) {
    return Boom.badImplementation(`error getting games: ${e}`);
  }
};

exports.retrievePast = async () => {
  const currentDate = new Date();
  try {
    return Game.find({ startTime: { $lt: currentDate } }).sort({
      startTime: 1
    });
  } catch (e) {
    return Boom.badImplementation(`error getting games: ${e}`);
  }
};

exports.retrieveFuture = async () => {
  const currentDate = new Date();
  try {
    return Game.find({ finishTime: { $gt: currentDate } }).sort({
      startTime: 1
    });
  } catch (e) {
    return Boom.badImplementation(`error getting games: ${e}`);
  }
};
exports.retrieveInPlay = async () => {
  const currentDate = new Date();
  try {
    return Game.find({
      startTime: { $gt: currentDate },
      finishTime: { $lt: currentDate }
    }).sort({
      startTime: 1
    });
  } catch (e) {
    return Boom.badImplementation(`error getting games: ${e}`);
  }
};

exports.setResult = async request => {
  // TODO
  // verify winner and runner-up come from the right group/game
  // verify winner and runner-up are not the same
  // update fixture automatically
  try {
    const { game, winner, runnerUp } = request.payload;

    // update game object
    const updatedGame = await Game.findOneAndUpdate(
      { _id: game },
      { $set: { winner, runnerUp } },
      { new: true }
    );

    const { tournament } = updatedGame;
    // increment events complete for tournament
    const updatedTournament = await Tournament.findOneAndUpdate(
      { _id: tournament },
      { $inc: { eventsComplete: 1 } },
      { new: true }
    );

    // set correct predictions
    const correctPredictions = await Prediction.updateMany(
      { game, team: winner },
      { $set: { correct: true } }
    );

    // set incorrect predictions
    const incorrectPredictions = await Prediction.updateMany(
      { game, team: { $not: { $eq: winner } } },
      { $set: { correct: false } }
    );

    // find players with correct prediction made
    const predictionsMade = await Prediction.find({ game });
    // reduce to ids
    const playerIdsWithPredictionMade = predictionsMade.map(
      prediction => prediction.player
    );
    const predictionDataforUpdate = predictionsMade.map(prediction => ({
      player: prediction.player,
      weighting: prediction.weighting,
      correct: prediction.correct ? 1 : 0
    }));

    // find players with no prediction made
    const playersWithNoPredictionMade = await Player.find({
      _id: { $nin: playerIdsWithPredictionMade }
    });
    // reduce to ids
    const playerIdsWithNoPredictionMade = playersWithNoPredictionMade.map(
      player => player._id
    );

    const updatedScoresetsCorrect = await Promise.all(
      predictionDataforUpdate.map(async prediction => {
        await Score.findOneAndUpdate(
          { player: prediction.player, tournament },
          {
            $inc: {
              pointsScored: prediction.weighting * prediction.correct,
              pointsUsed: prediction.weighting,
              correctPredictions: prediction.correct * 1,
              totalPredictions: 1
            }
          }
        );
      })
    );

    // update score sets for tournament for players with no prediction made
    const updatedScoreSetsAbsent = await Score.updateMany(
      { player: playerIdsWithNoPredictionMade, tournament },
      // pop takes out last (largest) number, sorted previously
      { $pop: { weightingsRemaining: 1 } }
    );

    return {
      updatedGame,
      updatedTournament,
      correctPredictions,
      incorrectPredictions,
      updatedScoresetsCorrect,
      updatedScoreSetsAbsent
    };
  } catch (e) {
    return Boom.badImplementation(`error setting result: ${e}`);
  }
};

exports.updateFixture = request => {
  // TODO
  // verify teams come from the right group/game
  // verify teams are not the same
  // no add to groups
  // max two teams for knockout
  const { game, teams } = request.payload;
  return Game.findOneAndUpdate(
    { _id: game },
    { $push: { teams: { $each: teams } } },
    { new: true }
  );
};

exports.delete = async request => {
  try {
    return Game.remove({ _id: request.params.id });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

const wcGames = require('../data/game-data');

exports.insert = async () => {
  try {
    const games = [];
    const tournament = await Tournament.findOne({ name: 'World Cup 2018' });
    for (let i = 0; i < wcGames.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const teams = await Team.find({ name: wcGames[i].teams });
      const teamIds = [];
      teams.forEach(team => {
        teamIds.push(team._id);
      });

      const game = {
        tournament: tournament._id,
        name: wcGames[i].name,
        startTime: new Date(wcGames[i].startTime),
        finishTime: new Date(wcGames[i].finishTime),
        teams: teamIds
      };
      games.push(game);
    }

    return Game.collection.insert(games);
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};
