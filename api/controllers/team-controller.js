const Boom = require('boom');
const queryString = require('querystring');
const categories = require('./category-controller');
const Team = require('../models/team-model');

exports.createOne = async request => {
  try {
    let { category } = request.payload;
    const { team } = request.payload;
    category = await categories.retrieve('', category);
    team.category = category._id;
    return new Team(team).save();
  } catch (e) {
    return Boom.badImplementation(`error creating team: ${e}`);
  }
};

exports.createMany = async request => {
  try {
    let { category } = request.payload.upload;
    const { teams } = request.payload.upload;
    category = await categories.retrieve('', category);
    teams.map(team => {
      // eslint-disable-next-line no-param-reassign
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
    console.log(teamIds);
    return Team.remove({ _id: { $in: teamIds } });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

/*
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
*/
