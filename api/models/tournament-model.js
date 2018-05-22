const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema({
  name: String,
  active: Boolean,
  events: Number,
  eventsComplete: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

module.exports = mongoose.model('Tournament', tournamentSchema);
