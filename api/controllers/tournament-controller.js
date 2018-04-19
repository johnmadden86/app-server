const Boom = require('boom');
const Tournament = require('../models/tournament-model');
// const Team = require('../models/team-model');

exports.create = async (request) => {
  try {
    return new Tournament(request.payload).save();
  } catch (e) {
    return Boom.badImplementation(`error creating tournament: ${e}`);
  }
};

exports.retrieveOne = (request) => {
  try {
    return Tournament.findOne({ _id: request.params.id });
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

exports.delete = async (request) => {
  try {
    return Tournament.remove({ _id: request.params.id });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

/*
exports.addQualifiedTeams = async (request) => {
  try {
    const { tournamentId } = request.payload;
    const Teams = await Team.find({ name: request.payload.teams });
    return Tournament.update(
      { _id: tournamentId },
      { $push: { qualifiedTeams: { $each: Teams } } },
      { returnNewDocument: true },
    );
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.removeQualifiedTeams = async (request) => {
  try {
    const { tournamentId } = request.payload;
    const Teams = await Team.find({ name: request.payload.teams });
    return Tournament.update(
      { _id: tournamentId },
      { $pull: { qualifiedTeams: Teams } },
      { returnNewDocument: true },
    );
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};
*/
