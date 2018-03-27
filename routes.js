const Controller = require('./api/controllers/user-controller');
const Validate = require('./api/controllers/input-validation');

module.exports = [
  {
    method: 'GET',
    path: '/',
    options: {
      auth: false,
      handler: () => 'Hello world',
    },
  },
  {
    method: 'POST',
    path: '/',
    options: {
      auth: false,
      handler: Controller.authenticate,
    },
  },
  {
    method: 'POST',
    path: '/users',
    options: {
      auth: false,
      handler: Controller.create,
      validate: Validate.signup,
    },
  },
  {
    method: 'GET',
    path: '/users/{id}',
    options: { handler: Controller.retrieveOne },
  },
  {
    method: 'GET',
    path: '/users',
    options: { handler: Controller.retrieveAll },
  },
  {
    method: 'POST',
    path: '/users/{id}',
    options: {
      handler: Controller.update,
      validate: Validate.signup,
    },
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    options: { handler: Controller.deleteOne },
  },
  {
    method: 'DELETE',
    path: '/users',
    options: {
      auth: false,
      handler: Controller.deleteAll,
    },
  },
  {
    method: 'GET',
    path: '/google',
    options: {
      auth: {
        strategy: 'google',
        mode: 'try',
      },
      handler: Controller.google,
    },
  },
];
