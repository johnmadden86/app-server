// @flow

const mongoose = require('mongoose');

const predictionSchema = mongoose.Schema({
  player: {
    // player making the prediction
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  tournament: {
    // tournament games are in
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  game: {
    // game making prediction on
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  team: {
    // team predicted to win
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
    // TODO validate team from game only
  },
  weighting: {
    // weighting given to prediction
    type: Number
    // TODO validate, remaining weights only
  },
  correct: Boolean // upon game result, correct = true, incorrect = false
});

module.exports = mongoose.model('Prediction', predictionSchema);
