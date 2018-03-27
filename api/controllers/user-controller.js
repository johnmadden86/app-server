const bCrypt = require('bcrypt');
const Boom = require('boom');
const Utils = require('./auth-controller');
const User = require('../models/user-model');

const saltRounds = 12;

exports.create = async (request) => {
  try {
    const user = new User(request.payload);
    user.password = await new Promise((resolve, reject) => {
      bCrypt.hash(user.password, saltRounds, (err, hash) => {
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
    newDetails.password = await new Promise((resolve, reject) => {
      bCrypt.hash(newDetails.password, saltRounds, (err, hash) => {
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

exports.deleteOne = async (request) => {
  try {
    const reply = await User.remove({ _id: request.params.id });
    return {
      success: true,
      message: `${reply.n} users removed`,
    };
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.deleteAll = async () => {
  try {
    const reply = await User.remove();
    return {
      success: true,
      message: `${reply.n} users removed`,
    };
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.authenticate = async (request) => {
  try {
    const enteredUser = request.payload;
    const foundUser = await User.findOne({ email: enteredUser.email });
    return new Promise((resolve, reject) => {
      bCrypt.compare(enteredUser.password, foundUser.password, (err, isValid) => {
        if (err) {
          return reject(Boom.badRequest(err));
        }
        if (isValid) {
          return resolve({
            success: true,
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

exports.google = async (request) => {
  if (!request.auth.isAuthenticated) {
    return `Authentication failed due to: ${request.auth.error.message}`;
  }
  try {
    // eslint-disable-next-line camelcase
    const { given_name, family_name, email } = request.auth.credentials.profile.raw;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      console.log(`logging in as ${foundUser.email}`);
      return ({
        success: true,
        user: foundUser,
        token: Utils.createToken(foundUser._id),
      });
    }
    const user = new User({
      firstName: given_name,
      lastName: family_name,
      email,
    });
    console.log(`registering ${user.email}`);
    await user.save();
    return {
      success: true,
      user,
      token: Utils.createToken(user._id),
    };
  } catch (e) {
    return Boom.badImplementation(`error creating user: ${e}`);
  }
};
