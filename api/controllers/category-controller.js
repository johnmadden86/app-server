const Boom = require('boom');
const Category = require('../models/category-model');

exports.create = async request => {
  try {
    const category = new Category(request.payload);
    return category.save();
  } catch (e) {
    return Boom.badImplementation(`error creating category: ${e}`);
  }
};

exports.retrieve = async (request, categoryName) => {
  const name = request.url ? request.url.query.name : categoryName;
  console.log(`retrieve category + name: ${name}`);
  try {
    return Category.findOne({ name });
  } catch (e) {
    return Boom.badImplementation(`error finding category: ${e}`);
  }
};

exports.delete = async request => {
  try {
    return Category.remove({ _id: request.params.id });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};
