const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: String,
  shortName: { type: String, minLength: 3, maxLength: 3 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  flags: {
    flat: {
      px16: String,
      px24: String,
      px32: String,
      px48: String,
      px64: String
    },
    shiny: {
      px16: String,
      px24: String,
      px32: String,
      px48: String,
      px64: String
    }
  }
});

module.exports = mongoose.model('Team', teamSchema);
