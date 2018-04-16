const Boom = require('boom');
const Game = require('../models/game-model');
const Utils = require('./auth-controller');

exports.create = async (request) => {
  // TODO
  // take player id, game id, one team, one number
};

exports.update = async (request) => {
  // TODO
  // use existing prediction id, change team, change number
};

exports.missed = () => {
  // TODO
  // run at fixture start
  // create new prediction
  // no team, i.e. success = false
  // highest remaining number
};

exports.resolve = () => {
  // TODO
  // run at fixture finish
  // success = true || false
  // add points
  // update league table
};


