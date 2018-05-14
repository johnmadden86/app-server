const mongoose = require('mongoose');

const leagueSchema = mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  name: String,
  playerLimit: Number,
  entryFee: Number,
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    }
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
      // TODO validate from this players
    }
  ],
  paidUpPlayers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    }
  ],
  prizes: [Number]
});

module.exports = mongoose.model('League', leagueSchema);
