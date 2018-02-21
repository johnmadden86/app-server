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
      hash: Joi.string().regex(/^[^\s]{8,16}$/).required(),
    },
  },
  handler: async (request) => {
    const user = new User(request.payload);
    user.hash = await new Promise((resolve, reject) => {
      bCrypt.hash(user.hash, saltRounds, (err, hash) => {
        if (err) {
          return reject(Boom.badRequest(err));
        }
        return resolve(hash);
      });
    });
    return user.save();
  },
};

exports.retrieveOne = {
  handler: request => User.findOne({ _id: request.params.id })
    .sort({ lastName: 1, firstName: 1 }),
};

exports.retrieveAll = {
  handler: () => User.find({})
    .sort({ lastName: 1, firstName: 1 }),
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
      hash: Joi.string().regex(/^[^\s]{8,16}$/).required(),
    },
  },
  handler: async (request) => {
    const newDetails = request.payload;
    const userId = request.params.id;
    newDetails.hash = await new Promise((resolve, reject) => {
      bCrypt.hash(newDetails.hash, saltRounds, (err, hash) => {
        if (err) {
          return reject(Boom.badRequest(err));
        }
        return resolve(hash);
      });
    });
    return User.findOneAndUpdate({ _id: userId }, newDetails)
      .then(user => ({ user, newDetails }));
  },
};

exports.deleteOne = {
  handler: request => User.remove({ _id: request.params.id })
    .catch(err => Boom.badImplementation(`error accessing db ${err}`)),
};

exports.deleteAll = {
  handler: () => User.remove({})
    .catch(err => Boom.badImplementation(`error accessing db ${err}`)),
};

