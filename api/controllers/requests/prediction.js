const Boom = require('boom');
const Utils = require('./auth-controller');
const Score = require('../../models/score-model');
const Prediction = require('../../models/prediction-model');

exports.createOrUpdate = async request => {
  try {
    const player = await Utils.getPlayerIdFromRequest(request);
    const { tournament, game, team } = request.payload;
    const newWeighting = request.payload.weighting;
    const prediction = await Prediction.findOneAndUpdate(
      { player, game },
      { $set: { team, weighting: newWeighting } },
      {
        upsert: true,
        new: false // return false to provide old weighting to update scores
      }
    );
    const oldWeighting = prediction ? prediction.weighting : null;
    console.log(prediction, oldWeighting);
    if (oldWeighting) {
      await Score.findOneAndUpdate(
        { player, tournament },
        {
          $pull: { weightingsUsed: oldWeighting },
          $push: { weightingsRemaining: { $each: [oldWeighting], $sort: 1 } }
        }
      );
    }
    const scores = await Score.findOneAndUpdate(
      { player, tournament }, // find player scores for tournament
      {
        $pull: { weightingsRemaining: newWeighting },
        $push: { weightingsUsed: { $each: [newWeighting], $sort: 1 } }
      },
      { new: true }
    );
    console.log({ scores, prediction });
    return { scores, prediction };
  } catch (e) {
    return Boom.badImplementation(`error creating prediction: ${e}`);
  }
};

exports.retrieve = async request => {
  try {
    const player = await Utils.getPlayerIdFromRequest(request);
    const gameIds = Object.values(request.url.query);
    return Prediction.find({ player, game: { $in: gameIds } }).sort({
      startTime: 1
    });
  } catch (e) {
    return Boom.badImplementation(`error finding predictions: ${e}`);
  }
};

exports.retrieveHelper = async (player, gameIds) => {
  try {
    return Prediction.find({ player, game: { $in: gameIds } }).sort({
      startTime: 1
    });
  } catch (e) {
    return Boom.badImplementation(`error finding predictions: ${e}`);
  }
};
