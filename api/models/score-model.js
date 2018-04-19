const mongoose = require('mongoose');

const scoreSchema = mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
  weightingsRemaining: [Number],
  weightingsUsed: [Number],
  pointsScored: { type: Number, default: 0 }, // sum of weightings used on correct predictions
  pointsUsed: { type: Number, default: 0 }, // sum of weightings used
});

module.exports = mongoose.model('Score', scoreSchema);
