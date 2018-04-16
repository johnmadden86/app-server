const CategoryController = require('./api/controllers/category-controller');
const TournamentController = require('./api/controllers/tournament-controller');
const PlayerController = require('./api/controllers/player-controller');
const LeagueController = require('./api/controllers/league-controller');
const GameController = require('./api/controllers/game-controller');
const PredictionController = require('./api/controllers/prediction-controller');
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

  /* Category methods */

  {
    method: 'POST',
    path: '/categories',
    options: {
      handler: CategoryController.create,
    },
  },
  {
    method: 'GET',
    path: '/categories/{id}',
    options: { handler: PlayerController.retrieveOne },
  },
  {
    method: 'GET',
    path: '/categories',
    options: { handler: PlayerController.retrieveAll },
  },
  {
    method: 'POST',
    path: '/categories/{id}',
    options: { handler: PlayerController.update },
  },
  {
    method: 'DELETE',
    path: '/categories/{id}',
    options: { handler: PlayerController.deleteOne },
  },

  /* Tournament methods */

  /* Player methods */

  {
    method: 'POST',
    path: '/',
    options: {
      auth: false,
      handler: PlayerController.authenticate,
    },
  },
  {
    method: 'POST',
    path: '/players',
    options: {
      auth: false,
      handler: PlayerController.create,
      validate: Validate.signup,
    },
  },
  {
    method: 'GET',
    path: '/players/{id}',
    options: { handler: PlayerController.retrieveOne },
  },
  {
    method: 'GET',
    path: '/players',
    options: {
      auth: false,
      handler: PlayerController.retrieveAll,
    },
  },
  {
    method: 'POST',
    path: '/players/{id}',
    options: {
      handler: PlayerController.update,
      validate: Validate.signup,
    },
  },
  {
    method: 'DELETE',
    path: '/players/{id}',
    options: { handler: PlayerController.deleteOne },
  },
  {
    method: 'DELETE',
    path: '/players',
    options: {
      auth: false,
      handler: PlayerController.deleteAll,
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
      handler: PlayerController.google,
    },
  },

  /* League methods */

  {
    method: 'POST',
    path: '/leagues',
    options: {
      handler: LeagueController.create,
      validate: Validate.league,
    },
  },
  {
    method: 'GET',
    path: '/leagues/{id}',
    options: { handler: LeagueController.retrieveOne },
  },
  {
    method: 'GET',
    path: '/leagues',
    options: { handler: LeagueController.retrieveAll },
  },
  {
    method: 'GET',
    path: '/players/{id}/leagues',
    options: { handler: LeagueController.retrieveAllForPlayer },
  },
  {
    method: 'POST',
    path: '/leagues/{id}',
    options: {
      handler: LeagueController.update,
      validate: Validate.league,
    },
  },
  {
    method: 'DELETE',
    path: '/leagues/{id}',
    options: { handler: LeagueController.deleteOne },
  },
  {
    method: 'DELETE',
    path: '/leagues',
    options: { handler: LeagueController.deleteAll },
  },
  {
    method: 'POST',
    path: '/leagues/join',
    options: { handler: LeagueController.joinLeague },
  },
  {
    method: 'GET',
    path: '/leagues/{id}/leave',
    options: { handler: LeagueController.leaveLeague },
  },
  {
    method: 'GET',
    path: '/leagues/update',
    options: { handler: LeagueController.updateTable },
  },

  /* Game methods */

  {
    method: 'POST',
    path: '/games',
    options: { handler: GameController.create },
  },
  {
    method: 'GET',
    path: '/games/{id}',
    options: { handler: GameController.retrieveOne },
  },
  {
    method: 'GET',
    path: '/games',
    options: { auth: false, handler: GameController.retrieveAll },
  },
  {
    method: 'GET',
    path: '/games/past',
    options: { handler: GameController.retrievePast },
  },
  {
    method: 'GET',
    path: '/games/future',
    options: { handler: GameController.retrieveFuture },
  },
  {
    method: 'POST',
    path: '/games/{id}/result',
    options: { handler: GameController.setResult },
  },
  {
    method: 'POST',
    path: '/games/{id}/fixture',
    options: { handler: GameController.updateFixture },
  },

  /* Prediction methods */

  {
    method: 'POST',
    path: '/predictions',
    options: { handler: PredictionController.create },
  },
  {
    method: 'POST',
    path: '/predictions/{id}',
    options: { handler: PredictionController.update },
  },
  {
    method: 'POST',
    path: '/predictions/resolve',
    options: { handler: PredictionController.resolve },
  },
  {
    method: 'POST',
    path: '/predictions/missed',
    options: { handler: PredictionController.missed },
  },
];
