const Boom = require('boom');
const Tournament = require('../../models/tournament-model');

exports.retrieveOneById = id => {
  try {
    return Tournament.findOne({ _id: id });
  } catch (e) {
    return Boom.badImplementation(`error getting tournament: ${e}`);
  }
};

exports.retrieveOneByName = name => {
  try {
    return Tournament.findOne({ name });
  } catch (e) {
    return Boom.badImplementation(`error getting tournament: ${e}`);
  }
};

exports.eventComplete = tournament => {
  try {
    return Tournament.findOneAndUpdate(
      { _id: tournament },
      { $inc: { eventsComplete: 1 } },
      { new: true }
    );
  } catch (e) {
    return Boom.badImplementation(`error getting tournament: ${e}`);
  }
};
