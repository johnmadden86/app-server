const mongoose = require('mongoose');

/*
 * Schema for the 'type' of tournament
 * will determine which teams can be added
 */
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    enum: ['Soccer - International', 'Soccer - Club'],
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Category', categorySchema);
