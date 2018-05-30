const Boom = require('boom');
const Category = require('../../models/category-model');

exports.retrieveByName = async name => {
  try {
    return Category.findOne({ name });
  } catch (e) {
    return Boom.badImplementation(`error finding category: ${e}`);
  }
};
