const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema({
  name: String,
  active: Boolean,
  events: Number,
  eventsComplete: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  logo: String
});

module.exports = mongoose.model('Tournament', tournamentSchema);

// http://content.sportslogos.net/logos/71/3029/full/1373_2018_world_cup_russia-primary-2018.png
