const mongoose = require('mongoose');

const predictionSchema = mongoose.Schema({
  player: { // player making the prediction
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  game: { // game making prediction on
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
  },
  team: { // team predicted to win
    type: String,
    enum: [
      'Argentina',
      'Australia',
      'Belgium',
      'Brazil',
      'Colombia',
      'Costa Rica',
      'Croatia',
      'Denmark',
      'Egypt',
      'England',
      'France',
      'Germany',
      'Iceland',
      'Iran',
      'Japan',
      'Mexico',
      'Morocco',
      'Nigeria',
      'Panama',
      'Peru',
      'Poland',
      'Portugal',
      'Russia',
      'Saudi Arabia',
      'Senegal',
      'Serbia',
      'South Korea',
      'Spain',
      'Sweden',
      'Switzerland',
      'Tunisia',
      'Uruguay',
    ],
  },
  weighting: { // weighting given to prediction
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  },
  correct: Boolean, // upon game result, correct = true, incorrect = false
});

module.exports = mongoose.model('Prediction', predictionSchema);
