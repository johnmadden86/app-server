const Boom = require('boom');
const categories = require('../helpers/category');
const Team = require('../../models/team-model');

exports.createOne = async request => {
  try {
    let { category } = request.payload;
    const { team } = request.payload;
    category = await categories.retrieveByName(category);
    team.category = category._id;
    return new Team(team).save();
  } catch (e) {
    return Boom.badImplementation(`error creating team: ${e}`);
  }
};

exports.createMany = async request => {
  try {
    let { category, teams } = request.payload.upload;
    category = await categories.retrieveByName(category);
    teams = teams.map(team => {
      team.category = category._id;
      return team;
    });
    return Team.collection.insert(teams);
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.deleteOne = async request => {
  try {
    return Team.remove({ _id: request.params.id });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.deleteMany = async request => {
  try {
    const teamIds = Object.values(request.url.query);
    return Team.remove({ _id: { $in: teamIds } });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};
