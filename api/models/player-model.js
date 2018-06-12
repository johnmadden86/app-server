const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: String
  // email: String,
  // password: String
});

module.exports = mongoose.model('Player', playerSchema);
