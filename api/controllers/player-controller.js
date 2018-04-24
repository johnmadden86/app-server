const bCrypt = require("bcrypt");
const Boom = require("boom");
const Utils = require("./auth-controller");
const Player = require("../models/player-model");

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

exports.retrieveOne = request => {
  try {
    return Player.findOne({ _id: request.params.id });
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
              return resolve({
                success: true,
                token: Utils.createToken(foundPlayer._id)
              });
            }
            return resolve({
              success: false,
              message: "Authentication failed - Incorrect Password"
            });
          }
        );
      });
    }
    return {
      success: false,
      message: "Authentication failed - Player Not Found"
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
    // eslint-disable-next-line camelcase
    const {
      given_name,
      family_name,
      email
    } = request.auth.credentials.profile.raw;
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
