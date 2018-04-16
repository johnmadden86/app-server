const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  qualifiedTeams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }], // qualified teams only
});

module.exports = mongoose.model('Tournament', tournamentSchema);
