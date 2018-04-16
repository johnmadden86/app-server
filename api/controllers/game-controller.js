const Boom = require('boom');
const Game = require('../models/game-model');

exports.create = async (request) => {
  try {
    const game = new Game(request.payload);
    await game.save();
    return {
      success: true,
      game,
    };
  } catch (e) {
    return Boom.badImplementation(`error creating game: ${e}`);
  }
};

exports.retrieveOne = async (request) => {
  try {
    return Game.findOne({ _id: request.params.id });
  } catch (e) {
    return Boom.badImplementation(`error getting game: ${e}`);
  }
};

exports.retrieveAll = async () => {
  try {
    return Game.find({}).sort({ startTime: 1 });
  } catch (e) {
    return Boom.badImplementation(`error getting players: ${e}`);
  }
};

exports.retrievePast = async () => {
  const currentDate = new Date();
  console.log(currentDate);
  try {
    return Game.find({ startTime: { $lt: currentDate } }).sort({ startTime: 1 });
  } catch (e) {
    return Boom.badImplementation(`error getting games: ${e}`);
  }
};

exports.retrieveFuture = async () => {
  const currentDate = new Date();
  try {
    return Game.find({ startTime: { $gt: currentDate } }).sort({ startTime: 1 });
  } catch (e) {
    return Boom.badImplementation(`error getting games: ${e}`);
  }
};

exports.setResult = () => {
  // TODO
  // run at game finish
  // runner-ups for groups
  // i) manual ii) fetch from external service
};

exports.updateFixture = () => {
  // TODO
  // run at game finish
  // update knockout fixtures in accordance with results
};

