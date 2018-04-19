const GameController = require('../api/controllers/game-controller');

module.exports = [
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
    path: '/games/result',
    options: { handler: GameController.setResult },
  },
  {
    method: 'POST',
    path: '/games/fixture',
    options: { handler: GameController.updateFixture },
  },
];
