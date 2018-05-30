const Boom = require('boom');
const Player = require('../../models/player-model');

exports.excludeFromIdList = async list => {
  try {
    return Player.find({ _id: { $nin: list } });
  } catch (e) {
    return Boom.badImplementation(`error getting players: ${e}`);
  }
};
