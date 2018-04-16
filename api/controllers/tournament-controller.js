const Boom = require('boom');
const Tournament = require('../models/tournament-model');
const Utils = require('./auth-controller');

exports.create = async (request) => {
  // TODO
  // new tournament
  // name
  // category
};

exports.addQualifiedTeams = async (request) => {
  // TODO
  // teams
};

exports.removeQualifiedTeams = async (request) => {
  // TODO
  // teams
};

exports.addGames = async (request) => {
  // TODO
  // from qualified teams
  // start and finish times
};

exports.updateGame = async (request) => {
  // TODO
  // from qualified teams
  // start and finish times
};

exports.removeGames = async (request) => {
  // TODO
  // from qualified teams
  // start and finish times
};

exports.retrieve = () => {
  // TODO
  // get by name / id
};


exports.update = async (request) => {
  // TODO
  // rename, re-categorize
};

exports.delete = () => {
  // TODO
  // run at fixture start
  // create new prediction
  // no team, i.e. success = false
  // highest remaining number
};



