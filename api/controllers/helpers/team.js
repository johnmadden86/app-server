const Boom = require('boom');
const Team = require('../../models/team-model');

exports.findByName = async names => {
  try {
    return await Team.find({ name: names });
  } catch (e) {
    return Boom.badImplementation(`error creating team: ${e}`);
  }
};
