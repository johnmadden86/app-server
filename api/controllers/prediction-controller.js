const Boom = require('boom');
const Game = require('../models/game-model');
const Utils = require('./auth-controller');
const Tournament = require('../models/tournament-model');
const Score = require('../models/score-model');
const Prediction = require('../models/prediction-model');

exports.create = async (request) => {
  // TODO
  // verify weightings remaining
  // remove weight used from array
  try {
    const player = await Utils.getPlayerIdFromRequest(request);
    const { game, team, weighting } = request.payload;
    return new Prediction({
      player, game, team, weighting,
    }).save();
  } catch (e) {
    return Boom.badImplementation(`error creating prediction: ${e}`);
  }
};

exports.update = async (request) => {
  // TODO
  // put old weighting back in array, take new weighting out
  try {
    const player = await Utils.getPlayerIdFromRequest(request);
    const { game, team, weighting } = request.payload;
    return Prediction.findOneAndUpdate(
      { player, game }, // find by both player id and game id
      { $set: { team, weighting } }, // update team and weighting
      { new: true }, // return new document
    );
  } catch (e) {
    return Boom.badImplementation(`error updating prediction: ${e}`);
  }
};

exports.missed = async (request) => {
  // TODO
  // run at fixture start
  // remove weighting
  try {
    const { player, game } = request.payload;
    const scores = Score.find({ player });
    const weighting = Math.max(scores.weightingsRemaining);
    return new Prediction({
      player, game, weighting, correct: false,
    }).save();
  } catch (e) {
    return Boom.badImplementation(`error creating missed prediction: ${e}`);
  }
};

exports.resolve = async (request) => {
  try {
    const { game } = request.payload;
    const finishedGame = Game.findOne({ game });
    await Prediction.findOneAndUpdate(
      { game, team: finishedGame.winner },
      { $set: { correct: true } },
    );
    await Prediction.findOneAndUpdate(
      { game, team: { $ne: finishedGame.winner } },
      { $set: { correct: false } },
    );
    return Prediction.find({ game });
  } catch (e) {
    return Boom.badImplementation(`error resolving prediction: ${e}`);
  }
};
