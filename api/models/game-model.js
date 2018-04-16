const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
  name: String, // e.g. groupA, quarterFinal2 etc.
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  startTime: Date,
  finishTime: Date, // 2 hours after kick-off of final group games, 3 hours after kick-off for knockout games
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  runnerUp: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }, // groups only (for creating knockout games)
});

module.exports = mongoose.model('Game', gameSchema);

/* enum: [
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
 ], */
