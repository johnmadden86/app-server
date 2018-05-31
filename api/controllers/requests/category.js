const Boom = require('boom');
const Category = require('../../models/category-model');
const CategoryHelper = require('../helpers/category');

exports.create = request => {
  try {
    const category = new Category(request.payload);
    return category.save();
  } catch (e) {
    return Boom.badImplementation(`error creating category: ${e}`);
  }
};

exports.retrieve = request => {
  try {
    const { name } = request.url.query;
    return CategoryHelper.retrieveByName(name);
  } catch (e) {
    return Boom.badImplementation(`error finding category: ${e}`);
  }
};

exports.delete = request => {
  try {
    return Category.remove({ _id: request.params.id });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};
