const Boom = require('boom');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

exports.tokenSecret = 'change-me-i-am-secret';
exports.schemeName = 'schemeName';
exports.strategyName = 'strategyName';

exports.createToken = userId => jwt.sign({ id: userId }, this.tokenSecret, { algorithm: 'HS256', expiresIn: '1h' });

exports.decodeToken = token => jwt.verify(token, this.tokenSecret, { algorithms: ['HS256', 'HS384'] });

exports.authenticate = async (request, h) => {
  try {
    const { authorization } = request.headers;
    const decoded = this.decodeToken(authorization);
    const user = await User.findOne({ _id: decoded.id });
    return h.authenticated({ credentials: { user } });
  } catch (err) {
    return Boom.unauthorized(err);
  }
};

exports.scheme = () => ({ authenticate: this.authenticate });
