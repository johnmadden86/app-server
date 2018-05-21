const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: String,
  shortName: { type: String, minLength: 3, maxLength: 3 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  imageUrl: String
});

module.exports = mongoose.model('Team', teamSchema);
