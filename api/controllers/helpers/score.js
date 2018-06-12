const Boom = require('boom');
const Score = require('../../models/score-model');

exports.newWeighting = (player, tournament, weighting) => {
  try {
    return Score.findOneAndUpdate(
      { player, tournament }, // find player scores for tournament
      {
        $pull: { weightingsRemaining: weighting },
        $push: {
          weightingsUsed: {
            $each: [weighting],
            $sort: 1
          }
        }
      },
      { new: true }
    );
  } catch (e) {
    return Boom.badImplementation(`error updating scores: ${e}`);
  }
};

exports.oldWeighting = (player, tournament, weighting) => {
  try {
    return Score.findOneAndUpdate(
      { player, tournament },
      {
        $pull: { weightingsUsed: weighting },
        $push: {
          weightingsRemaining: {
            $each: [weighting],
            $sort: 1
          }
        }
      }
    );
  } catch (e) {
    return Boom.badImplementation(`error updating scores: ${e}`);
  }
};

exports.update = (tournament, prediction) => {
  try {
    return Score.findOneAndUpdate(
      { player: prediction.player, tournament },
      {
        $inc: {
          pointsScored: prediction.weighting * prediction.correct,
          pointsUsed: prediction.weighting,
          correctPredictions: prediction.correct,
          totalPredictions: 1
        }
      },
      { new: true }
    );
  } catch (e) {
    return Boom.badImplementation(`error updating scores: ${e}`);
  }
};

exports.create = (tournament, player, weightingsRemaining) => {
  try {
    return Score.findOneAndUpdate(
      { player, tournament },
      {
        $setOnInsert: {
          weightingsRemaining,
          weightingsUsed: [],
          pointsScored: 0,
          pointsUsed: 0,
          correctPredictions: 0,
          totalPredictions: 0
        }
      },
      { upsert: true, new: true }
    );
  } catch (e) {
    return Boom.badImplementation(`error updating scores: ${e}`);
  }
};

exports.updateAbsent = (players, tournament) => {
  try {
    // update score sets for tournament for players with no prediction made
    return Score.updateMany(
      { player: players, tournament },
      // pop takes out last (largest) number, sorted previously
      { $pop: { weightingsRemaining: 1 } }
    );
  } catch (e) {
    return Boom.badImplementation(`error getting scores: ${e}`);
  }
};
