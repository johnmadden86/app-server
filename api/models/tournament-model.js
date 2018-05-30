const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: false },
  events: { type: Number, required: true },
  eventsComplete: { type: Number, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  logoUrl: String
});

module.exports = mongoose.model('Tournament', tournamentSchema);

// http://content.sportslogos.net/logos/71/3029/full/1373_2018_world_cup_russia-primary-2018.png
