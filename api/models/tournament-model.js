const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema({
  name: String,
  active: Boolean,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }] // qualified teams only
});

module.exports = mongoose.model('Tournament', tournamentSchema);
