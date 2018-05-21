const PlayerController = require('../api/controllers/player-controller');
const Validate = require('../api/controllers/input-validation');

module.exports = [
  {
    method: 'GET',
    path: '/',
    options: {
      auth: false,
      handler: () => 'Hello world'
    }
  },
  {
    method: 'POST',
    path: '/',
    options: {
      auth: false,
      handler: PlayerController.authenticate
    }
  },
  {
    method: 'POST',
    path: '/players',
    options: {
      auth: false,
      handler: PlayerController.create,
      validate: Validate.signup
    }
  },
  {
    method: 'GET',
    path: '/player',
    options: { handler: PlayerController.retrieveLoggedInPlayer }
  },
  {
    method: 'GET',
    path: '/players/{id}',
    options: { handler: PlayerController.retrieveOne }
  },
  {
    method: 'GET',
    path: '/players',
    options: {
      auth: false,
      handler: PlayerController.retrieveAll
    }
  },
  {
    method: 'POST',
    path: '/players/{id}',
    options: {
      handler: PlayerController.update,
      validate: Validate.signup
    }
  },
  {
    method: 'DELETE',
    path: '/players/{id}',
    options: { handler: PlayerController.deleteOne }
  },
  {
    method: 'DELETE',
    path: '/players',
    options: {
      auth: false,
      handler: PlayerController.deleteAll
    }
  },
  {
    method: 'GET',
    path: '/google',
    options: {
      auth: {
        strategy: 'google',
        mode: 'try'
      },
      handler: PlayerController.google
    }
  }
];
