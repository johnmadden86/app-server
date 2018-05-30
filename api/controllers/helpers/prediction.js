const Boom = require('boom');
const Prediction = require('../../models/prediction-model');

exports.retrieveFromGameList = (player, gameIds) => {
  try {
    return Prediction.find({ player, game: { $in: gameIds } }).sort({
      startTime: 1
    });
  } catch (e) {
    return Boom.badImplementation(`error finding predictions: ${e}`);
  }
};

exports.retrieveForGame = game => {
  try {
    return Prediction.find({ game });
  } catch (e) {
    return Boom.badImplementation(`error finding predictions: ${e}`);
  }
};

exports.setCorrect = (game, winner) => {
  try {
    return Prediction.updateMany(
      { game, team: winner },
      { $set: { correct: true } }
    );
  } catch (e) {
    return Boom.badImplementation(`error setting predictions: ${e}`);
  }
};

exports.setIncorrect = (game, winner) => {
  try {
    return Prediction.updateMany(
      { game, team: { $not: { $eq: winner } } },
      { $set: { correct: false } }
    );
  } catch (e) {
    return Boom.badImplementation(`error setting predictions: ${e}`);
  }
};
