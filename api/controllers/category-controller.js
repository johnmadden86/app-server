const Boom = require('boom');
const Category = require('../models/category-model');

exports.create = async request => {
  try {
    const category = new Category(request.payload);
    await category.save();
    return {
      success: true,
      category
    };
  } catch (e) {
    return Boom.badImplementation(`error creating category: ${e}`);
  }
};

exports.retrieveOne = request => {
  try {
    return Category.findOne({ _id: request.params.id });
  } catch (e) {
    return Boom.badImplementation(`error getting category: ${e}`);
  }
};

exports.retrieveAll = () => {
  try {
    return Category.find({}).sort({ name: 1 });
  } catch (e) {
    return Boom.badImplementation(`error getting categories: ${e}`);
  }
};

exports.delete = async request => {
  try {
    const reply = await Category.remove({ _id: request.params.id });
    return {
      success: true,
      message: `${reply.n} categories removed`
    };
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};
