const Boom = require('boom');
const jwt = require('jsonwebtoken');
const Player = require('../models/player-model');

exports.schemeName = 'schemeName';
exports.strategyName = 'strategyName';
exports.tokenSecret = 'change-me-i-am-secret';

exports.createToken = playerId =>
  jwt.sign({ id: playerId }, this.tokenSecret, {
    algorithm: 'HS256',
    expiresIn: '12h'
  });

exports.decodeToken = token =>
  jwt.verify(token, this.tokenSecret, { algorithms: ['HS256', 'HS384'] });

exports.scheme = () => ({ authenticate: this.authenticate });

exports.authenticate = async (request, h) => {
  try {
    const { authorization } = request.headers; // 1
    const decoded = this.decodeToken(authorization); // 2
    const player = await Player.findOne({ _id: decoded.id }); // 3
    return h.authenticated({ credentials: { player } });
  } catch (err) {
    return Boom.unauthorized(err);
  }
};

exports.getPlayerIdFromRequest = request => {
  const { authorization } = request.headers;
  const decoded = this.decodeToken(authorization);
  return decoded.id;
};

exports.getPlayerFromRequest = async request => {
  const _id = this.getPlayerIdFromRequest(request);
  return Player.findOne({ _id });
};

exports.googleOAuthOptions = server => ({
  provider: 'google',
  password: 'cookie_encryption_password_secure',
  isSecure: false,
  clientId:
    '228726651093-i6cogib8up91319cqrn03p784i0sti1d.apps.googleusercontent.com',
  clientSecret: '6aCyq6AwzQaOqGouwQValHxT',
  location: server.info.uri
});
