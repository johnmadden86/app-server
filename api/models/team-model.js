const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  shortName: {
    type: String,
    minLength: 3,
    maxLength: 3,
    required: true,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  flagUrl: String,
  crestUrl: String
});

module.exports = mongoose.model('Team', teamSchema);
