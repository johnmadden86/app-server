const Boom = require('boom');
const Utils = require('./auth-controller');
const Prediction = require('../../models/prediction-model');
const PredictionHelper = require('../helpers/prediction');
const ScoreHelper = require('../helpers/score');

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
    if (oldWeighting) {
      // replace old weighting
      await ScoreHelper.oldWeighting(player, tournament, oldWeighting);
    }
    const scores = await ScoreHelper.newWeighting(
      player,
      tournament,
      newWeighting
    );
    return { scores, prediction };
  } catch (e) {
    return Boom.badImplementation(`error creating prediction: ${e}`);
  }
};

exports.retrieve = async request => {
  try {
    const player = await Utils.getPlayerIdFromRequest(request);
    const gameIds = Object.values(request.url.query);
    return PredictionHelper.retrieveFromGameList(player, gameIds);
  } catch (e) {
    return Boom.badImplementation(`error finding predictions: ${e}`);
  }
};

exports.retrieveOne = async request => {
  try {
    const player = await Utils.getPlayerIdFromRequest(request);
    const { game } = request.params;
    return Prediction.findOne({ player, game }).populate('team');
  } catch (e) {
    return Boom.badImplementation(`error finding prediction: ${e}`);
  }
};
