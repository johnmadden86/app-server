const mongoose = require('mongoose');

const pointWeightSchema = mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
  weightingsRemaining: {
    type: [Number], default: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  },
  weightingsUsed: [Number],
  pointsScored: { type: Number, default: 0 }, // sum of weightings used on correct predictions
  pointsUsed: { type: Number, default: 0 }, // sum of weightings used
});

module.exports = mongoose.model('pointsWeights', pointWeightSchema);
