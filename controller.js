'use strict';

const User = require('./user-model');
const Boom = require('boom');

exports.addNew = {
  handler: async function (request, h) {
    const user = new User(request.payload);
    return await user.save()
        .then(newUser => {
          return newUser;
        })
        .catch(err => {
          return Boom.badImplementation('error creating user');
        });
  },
};

exports.findAll = {
  handler: async function () {
    return await User.find({})
                     .sort({lastName: 1, firstName: 1})
                     .then(users => {
                       console.log(users);
                       return users;
                     })
                     .catch(err => {
                       return Boom.badImplementation('error accessing db');
                     });
  },
};
