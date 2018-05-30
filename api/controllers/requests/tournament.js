const Boom = require('boom');
const Tournament = require('../../models/tournament-model');
const TournamentHelper = require('../helpers/tournament');

exports.create = async request => {
  try {
    console.log(request.payload);
    return new Tournament(request.payload).save();
  } catch (e) {
    return Boom.badImplementation(`error creating tournament: ${e}`);
  }
};

exports.retrieveOne = request => {
  try {
    return TournamentHelper.retrieveOneById(request.params.id);
  } catch (e) {
    return Boom.badImplementation(`error getting tournament: ${e}`);
  }
};

exports.retrieveAll = () => {
  try {
    return Tournament.find({}).sort({ name: 1 });
  } catch (e) {
    return Boom.badImplementation(`error getting tournaments: ${e}`);
  }
};

exports.delete = async request => {
  try {
    return Tournament.remove({ _id: request.params.id });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};
