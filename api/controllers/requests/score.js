const Boom = require('boom');
const TournamentHelper = require('../helpers/tournament');
const Score = require('../../models/score-model');
const Utils = require('./auth-controller');

exports.createOrRetrieve = async request => {
  try {
    const player = await Utils.getPlayerIdFromRequest(request);
    const { tournamentId } = request.url.query;
    const tournament = await TournamentHelper.retrieveOneById(tournamentId);
    const weightingsRemaining = [];
    for (let i = 0; i < tournament.events; i += 1) {
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
