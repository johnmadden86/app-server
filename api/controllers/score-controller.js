const Boom = require('boom');
const Tournament = require('../models/tournament-model');
const Score = require('../models/score-model');
const Utils = require('./auth-controller');

exports.create = async (request) => {
  try {
    const player = await Utils.getPlayerIdFromRequest(request);
    const tournamentId = request.payload.tournament;
    const tournament = await Tournament.find({ _id: tournamentId });
    const weightingsRemaining = [];
    for (let i = 0; i < tournament.games.length; i += 1) {
      weightingsRemaining.push(i + 1);
    }
    return new Score({ player, tournament: tournamentId, weightingsRemaining }).save();
  } catch (e) {
    return Boom.badImplementation(`error creating league: ${e}`);
  }
};
