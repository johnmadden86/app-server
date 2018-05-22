const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
  name: String, // e.g. groupA, quarterFinal2 etc.
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  startTime: Date,
  finishTime: Date,
  // 2 hours after kick-off of final group games, 3 hours after kick-off for knockout games
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
    // TODO validate to only come from teams in game
    /* validate: {
      validator(value) {
        return this.teams.includes(value);
      }
    } */
  },
  runnerUp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  } // groups only (for creating knockout games)
});

module.exports = mongoose.model('Game', gameSchema);
