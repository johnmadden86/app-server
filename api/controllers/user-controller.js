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
    try {
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
    } catch (e) {
      return Boom.badImplementation(`error creating user: ${e}`);
    }
  },
};

exports.retrieveOne = {
  handler: (request) => {
    try {
      return User.findOne({ _id: request.params.id });
    } catch (e) {
      return Boom.badImplementation(`error getting user: ${e}`);
    }
  },
};

exports.retrieveAll = {
  handler: () => {
    try {
      return User.find({}).sort({ lastName: 1, firstName: 1 });
    } catch (e) {
      return Boom.badImplementation(`error gettting users: ${e}`);
    }
  },
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
    try {
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
      await User.findOneAndUpdate({ _id: userId }, newDetails);
      return User.find({ _id: userId });
    } catch (e) {
      return Boom.badImplementation(`error updating user: ${e}`);
    }
  },
};

exports.deleteOne = {
  handler: (request) => {
    try {
      return User.remove({ _id: request.params.id });
    } catch (err) {
      return Boom.badImplementation(`error accessing db ${err}`);
    }
  },
};

exports.deleteAll = {
  handler: () => {
    try {
      return User.remove();
    } catch (err) {
      return Boom.badImplementation(`error accessing db ${err}`);
    }
  },
};

exports.authenticate = {
  handler: async (request) => {
    try {
      const enteredUser = request.payload;
      const foundUser = await User.findOne({ email: enteredUser.email });
      return new Promise((resolve, reject) => {
        bCrypt.compare(enteredUser.hash, foundUser.hash, (err, isValid) => {
          if (err) {
            return reject(Boom.badRequest(err));
          }
          if (isValid) {
            return resolve({
              success: true,
              user: foundUser,
            });
          }
          return resolve({
            success: false,
            message: 'Authentication failed\nUser not found',
          });
        });
      });
    } catch (e) {
      return Boom.badImplementation(`error accessing db ${e}`);
    }
  },
};

