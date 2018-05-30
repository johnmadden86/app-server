const Boom = require('boom');
const Score = require('../../models/score-model');

exports.update = (tournament, prediction) => {
  try {
    return Score.findOneAndUpdate(
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
  } catch (e) {
    return Boom.badImplementation(`error updating scores: ${e}`);
  }
};

exports.updateAbsent = async (players, tournament) => {
  try {
    // update score sets for tournament for players with no prediction made
    return await Score.updateMany(
      { player: players, tournament },
      // pop takes out last (largest) number, sorted previously
      { $pop: { weightingsRemaining: 1 } }
    );
  } catch (e) {
    return Boom.badImplementation(`error getting scores: ${e}`);
  }
};
