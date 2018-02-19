const User = require('./api/models/user');
const Boom = require('boom');

exports.addNew = {
  handler: async (request) => {
    const user = new User(request.payload);
    return user.save()
      .then(newUser => newUser)
      .catch(err => Boom.badImplementation(`error creating user ${err}`));
  },
};

exports.findAll = {
  handler: async () => {
    return User.find({})
      .sort({ lastName: 1, firstName: 1 })
      .then(users => users)
      .catch(err => Boom.badImplementation(`error accessing db ${err}`));
  },
};
