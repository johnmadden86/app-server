const User = require('../models/user-model');
const Boom = require('boom');
const Joi = require('joi');
const bCrypt = require('bcrypt');

const saltRounds = 12;

exports.create = {
  validate: {
    failAction(request, h, err) {
      return err;
    },
    options: {
      abortEarly: false,
    },
    payload: {
      firstName: Joi.string().regex(/^[a-zA-Z\s'-]{2,16}$/).required(),
      lastName: Joi.string().regex(/^[a-zA-Z\s'-]{2,32}$/).required(),
      email: Joi.string().email().required(),
      password: Joi.string().regex(/^[^\s]{8,16}$/).required(),
    },
  },
  handler: async (request) => {
    const user = new User(request.payload);
    user.password = await new Promise((resolve) => {
      bCrypt.hash(user.password, saltRounds, (err, hash) => resolve(hash));
    });
    return user.save();
  },
};

exports.retrieveOne = {
  handler: async request => User.findOne({ _id: request.params.id })
    .sort({ lastName: 1, firstName: 1 })
    .then(users => users)
    .catch(err => Boom.badImplementation(`error accessing db ${err}`)),
};

exports.retrieveAll = {
  handler: async () => User.find({})
    .sort({ lastName: 1, firstName: 1 })
    .then(users => users)
    .catch(err => Boom.badImplementation(`error accessing db ${err}`)),
};

exports.update = {
  validate: {
    failAction(request, h, err) {
      return err;
    },
    options: {
      abortEarly: false,
    },
    payload: {
      firstName: Joi.string().regex(/^[a-zA-Z\s'-]{2,16}$/).required(),
      lastName: Joi.string().regex(/^[a-zA-Z\s'-]{2,32}$/).required(),
      email: Joi.string().email().required(),
      password: Joi.string().regex(/^[^\s]{8,16}$/).required(),
    },
  },
  handler: async (request) => {
    const newDetails = request.payload;
    const userId = request.params.id;
    newDetails.password = await new Promise((resolve) => {
      bCrypt.hash(newDetails.password, saltRounds, (err, hash) => resolve(hash));
    });
    return User.findOneAndUpdate({ _id: userId }, newDetails)
      .then(user => ({ user, newDetails }));
  },
};

exports.deleteOne = {
  handler: async (request, h) => User.remove({ _id: request.params.id })
    .then(() => h.response)
    .catch(err => Boom.badImplementation(`error accessing db ${err}`)),
};

exports.deleteAll = {
  handler: async (request, h) => User.remove({})
    .then(() => h.response)
    .catch(err => Boom.badImplementation(`error accessing db ${err}`)),
};

