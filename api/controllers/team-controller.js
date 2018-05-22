const Boom = require('boom');
const Team = require('../models/team-model');

exports.create = async request => {
  try {
    return new Team(request.payload).save();
    // http://www.countryflags.io/be/flat/64.png
  } catch (e) {
    return Boom.badImplementation(`error creating team: ${e}`);
  }
};

exports.findByName = async request => {
  try {
    const { team } = request.url.query;
    return Team.findOne({ name: team });
  } catch (e) {
    return Boom.badImplementation(`error creating team: ${e}`);
  }
};

exports.retrieveOne = request => {
  try {
    return Team.findOne({ _id: request.params.id });
  } catch (e) {
    return Boom.badImplementation(`error getting team: ${e}`);
  }
};

exports.retrieveAll = () => {
  try {
    return Team.find({}).sort({ name: 1 });
  } catch (e) {
    return Boom.badImplementation(`error getting teams: ${e}`);
  }
};

exports.update = request => {
  try {
    const newDetails = request.payload;
    const teamId = request.params.id;
    return Team.findOneAndReplace({ _id: teamId }, newDetails, {
      new: true
    });
  } catch (e) {
    return Boom.badImplementation(`error updating team: ${e}`);
  }
};

exports.delete = async request => {
  try {
    return Team.remove({ _id: request.params.id });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

const { teams } = require('../data/wc-teams');

exports.insert = async () => {
  try {
    const wcTeams = teams.map(team => ({
      name: team.name,
      shortName: team.code,
      category: '5ad761a0a22d7a31b8f7512f',
      flag: team.crestUrl
    }));

    return Team.collection.insert(wcTeams);
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};
