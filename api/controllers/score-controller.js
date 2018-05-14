const Boom = require('boom');
const Tournament = require('../models/tournament-model');
const Score = require('../models/score-model');
const Utils = require('./auth-controller');

exports.createOrRetrieve = async request => {
  try {
    const player = await Utils.getPlayerIdFromRequest(request);
    const { tournamentId } = request.url.query;
    const tournament = await Tournament.findOne({ _id: tournamentId });
    const weightingsRemaining = [];
    for (let i = 0; i < tournament.games.length; i += 1) {
      weightingsRemaining.push(i + 1);
    }
    return Score.findOneAndUpdate(
      { player, tournament: tournamentId },
      { $setOnInsert: { weightingsRemaining } },
      { upsert: true, new: true }
    );
  } catch (e) {
    return Boom.badImplementation(`error getting scores: ${e}`);
  }
};
