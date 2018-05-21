const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

module.exports = mongoose.model('Player', playerSchema);
