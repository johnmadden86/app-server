const Boom = require('boom');
const Game = require('../models/game-model');

exports.create = async (request) => {
  try {
    return new Game(request.payload).save();
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
    return Boom.badImplementation(`error getting games: ${e}`);
  }
};

exports.retrievePast = async () => {
  const currentDate = new Date();
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

exports.setResult = async (request) => {
  // TODO
  // verify winner and runner-up come from the right group/game
  // verify winner and runner-up are not the same
  // update fixture automatically
  try {
    const { game, winner, runnerUp } = request.payload;
    return Game.findOneAndUpdate(
      { _id: game },
      { $set: { winner, runnerUp } },
      { new: true },
    );
  } catch (e) {
    return Boom.badImplementation(`error setting result: ${e}`);
  }
};

exports.updateFixture = (request) => {
  // TODO
  // verify teams come from the right group/game
  // verify teams are not the same
  // no add to groups
  // max two teams for knockout
  const { game, teams } = request.payload;
  return Game.findOneAndUpdate(
    { _id: game },
    { $push: { teams: { $each: teams } } },
    { new: true },
  );
};

exports.delete = async (request) => {
  try {
    return Game.remove({ _id: request.params.id });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

