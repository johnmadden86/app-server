const bCrypt = require('bcrypt');
const Boom = require('boom');
const Utils = require('./auth-controller');
const User = require('../models/user-model');

const saltRounds = 12;

exports.create = async (request) => {
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
    await user.save();
    return {
      success: true,
      user,
      // eslint-disable-next-line no-underscore-dangle
      token: Utils.createToken(user._id),
    };
  } catch (e) {
    return Boom.badImplementation(`error creating user: ${e}`);
  }
};

exports.retrieveOne = (request) => {
  try {
    return User.findOne({ _id: request.params.id });
  } catch (e) {
    return Boom.badImplementation(`error getting user: ${e}`);
  }
};

exports.retrieveAll = () => {
  try {
    return User.find({}).sort({ lastName: 1, firstName: 1 });
  } catch (e) {
    return Boom.badImplementation(`error gettting users: ${e}`);
  }
};

exports.update = async (request) => {
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
};

exports.deleteOne = (request) => {
  try {
    return User.remove({ _id: request.params.id });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.deleteAll = () => {
  try {
    return User.remove();
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.authenticate = async (request) => {
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
            // eslint-disable-next-line no-underscore-dangle
            token: Utils.createToken(foundUser._id),
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
};

