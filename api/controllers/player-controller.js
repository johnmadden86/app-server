const Utils = require('./auth-controller');

const bCrypt = require('bcrypt');
const Boom = require('boom');
const Player = require('../models/player-model');

const saltRounds = 12;

exports.create = async request => {
  try {
    const player = new Player(request.payload);
    player.password = await new Promise((resolve, reject) => {
      bCrypt.hash(player.password, saltRounds, (err, hash) => {
        if (err) {
          return reject(Boom.badRequest(err));
        }
        return resolve(hash);
      });
    });

    await player.validate();

    // await player.save();
    console.log('no error');

    return {
      success: true,
      player,
      token: Utils.createToken(player._id)
    };
  } catch (e) {
    const error = new Boom(e, { statusCode: 412 });
    console.log(error.errors);
    // error.reformat();
    console.log(new Date('7 July 2018 18:00 UTC+4'));
    error.output.payload.custom = 'abc_123';
    return error;
  }
};

exports.retrieveOne = request => {
  try {
    return Player.findOne({ _id: request.params.id });
  } catch (e) {
    return Boom.badImplementation(`error getting player: ${e}`);
  }
};

exports.retrieveLoggedInPlayer = async request => {
  try {
    return Utils.getPlayerFromRequest(request);
  } catch (e) {
    return Boom.badImplementation(`error getting player: ${e}`);
  }
};

exports.retrieveAll = () => {
  try {
    return Player.find({}).sort({ lastName: 1, firstName: 1 });
  } catch (e) {
    return Boom.badImplementation(`error getting players: ${e}`);
  }
};

exports.update = async request => {
  try {
    const newDetails = request.payload;
    const playerId = request.params.id;
    newDetails.password = await new Promise((resolve, reject) => {
      bCrypt.hash(newDetails.password, saltRounds, (err, hash) => {
        if (err) {
          return reject(Boom.badRequest(err));
        }
        return resolve(hash);
      });
    });
    return Player.findOneAndReplace({ _id: playerId }, newDetails, {
      new: true
    });
  } catch (e) {
    return Boom.badImplementation(`error updating player: ${e}`);
  }
};

exports.deleteOne = async request => {
  try {
    return Player.remove({ _id: request.params.id });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.deleteAll = async () => {
  try {
    return Player.remove();
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.authenticate = async request => {
  try {
    const enteredPlayer = request.payload;
    const foundPlayer = await Player.findOne({ email: enteredPlayer.email });
    if (foundPlayer) {
      return new Promise((resolve, reject) => {
        bCrypt.compare(
          enteredPlayer.password,
          foundPlayer.password,
          (err, isValid) => {
            if (err) {
              return reject(Boom.badRequest(err));
            }
            if (isValid) {
              const { _id, firstName, lastName, email } = foundPlayer;
              return resolve({
                success: true,
                token: Utils.createToken(foundPlayer._id),
                player: { _id, firstName, lastName, email }
              });
            }
            return resolve({
              success: false,
              message: 'Authentication failed - Incorrect Password'
            });
          }
        );
      });
    }
    return {
      success: false,
      message: 'Authentication failed - Player Not Found'
    };
  } catch (e) {
    return Boom.badImplementation(`error accessing db ${e}`);
  }
};

exports.google = async request => {
  if (!request.auth.isAuthenticated) {
    return `Authentication failed due to: ${request.auth.error.message}`;
  }
  try {
    // eslint-disable-next-line camelcase,prettier/prettier
    const { given_name, family_name, email } = request.auth.credentials.profile.raw;
    const foundPlayer = await Player.findOne({ email });
    if (foundPlayer) {
      return {
        success: true,
        player: foundPlayer,
        token: Utils.createToken(foundPlayer._id)
      };
    }
    const player = new Player({
      firstName: given_name,
      lastName: family_name,
      email
    });
    await player.save();
    return {
      success: true,
      player,
      token: Utils.createToken(player._id)
    };
  } catch (e) {
    return Boom.badImplementation(`error creating player: ${e}`);
  }
};
