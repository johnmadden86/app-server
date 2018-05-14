const Boom = require('boom');
const Tournament = require('../models/tournament-model');

exports.create = async request => {
  try {
    return new Tournament(request.payload).save();
  } catch (e) {
    return Boom.badImplementation(`error creating tournament: ${e}`);
  }
};

exports.retrieveOne = request => {
  try {
    return Tournament.findOne({ _id: request.params.id });
  } catch (e) {
    return Boom.badImplementation(`error getting tournament: ${e}`);
  }
};

exports.retrieveAll = () => {
  try {
    return Tournament.find({})
      .sort({ name: 1 })
      .populate('games');
  } catch (e) {
    return Boom.badImplementation(`error getting tournaments: ${e}`);
  }
};

exports.setActive = async request => {
  try {
    const tournament = await Tournament.findOne({ _id: request.params.id });
    return Tournament.update(
      { _id: request.params.id },
      { active: !tournament.active },
      { new: true }
    );
  } catch (e) {
    return Boom.badImplementation(`error getting tournament: ${e}`);
  }
};

exports.delete = async request => {
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
