const Boom = require('boom');
const League = require('../models/league-model');
const Utils = require('./auth-controller');

exports.create = async (request) => {
  try {
    const league = new League(request.payload); // payload = [ name, entryFee ]
    const playerId = await Utils.getPlayerIdFromRequest(request);
    league.players.push(playerId);
    league.admins.push(playerId);
    await league.save();
    return {
      success: true,
      league,
    };
  } catch (e) {
    return Boom.badImplementation(`error creating league: ${e}`);
  }
};

exports.retrieveOne = (request) => {
  try {
    return League.findOne({ _id: request.params.id });
  } catch (e) {
    return Boom.badImplementation(`error getting league: ${e}`);
  }
};

exports.retrieveAll = () => {
  try {
    return League.find({}).sort({ title: 1 });
  } catch (e) {
    return Boom.badImplementation(`error getting leagues: ${e}`);
  }
};

exports.retrieveAllForPlayer = async (request) => {
  const playerId = await Utils.getPlayerIdFromRequest(request);
  try {
    return League.find({ players: playerId }).sort({ title: 1 });
  } catch (e) {
    return Boom.badImplementation(`error getting leagues: ${e}`);
  }
};

exports.update = async (request) => {
  try {
    const newDetails = request.payload; // name, entryFee
    const leagueId = request.params.id;
    await League.findOneAndUpdate({ _id: leagueId }, newDetails);
    return League.find({ _id: leagueId });
  } catch (e) {
    return Boom.badImplementation(`error updating league: ${e}`);
  }
};

exports.setPrizes = async () => {
  // TODO
};

exports.deleteOne = async (request) => {
  try {
    const reply = await League.remove({ _id: request.params.id });
    return {
      success: true,
      message: `${reply.n} leagues removed`,
    };
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.deleteAll = async () => {
  try {
    const reply = await League.remove();
    return {
      success: true,
      message: `${reply.n} leagues removed`,
    };
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.joinLeague = async (request) => {
  try {
    const league = await League.findOne({ _id: request.payload.leagueId });
    const playerId = await Utils.getPlayerIdFromRequest(request);
    const index = league.players.indexOf(playerId);
    if (index === -1) {
      league.players.push(playerId);
    }
    await league.save();
    return {
      success: true,
      league,
    };
  } catch (e) {
    return Boom.badImplementation(`error creating league: ${e}`);
  }
};

exports.leaveLeague = async (request) => {
  try {
    const league = await League.findOne({ _id: request.params.id });
    const playerId = await Utils.getPlayerIdFromRequest(request);
    const index = league.players.indexOf(playerId);
    if (index > -1) {
      league.players.splice(index, 1);
    }
    await league.save();
    return {
      success: true,
      league,
    };
  } catch (e) {
    return Boom.badImplementation(`error creating league: ${e}`);
  }
};

exports.updateTable = () => {
  // TODO
};

// TODO comment methods
