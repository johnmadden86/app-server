const mongoose = require('mongoose');

const leagueSchema = mongoose.Schema({
  name: String,
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
  },
  playerLimit: Number,
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  }],
  paidUpPlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  }],
  entryFee: Number,
  prizes: [Number],
});

module.exports = mongoose.model('League', leagueSchema);
