const GameController = require('../api/controllers/requests/game');

module.exports = [
  {
    method: 'POST',
    path: '/game',
    options: { handler: GameController.createOne }
  },
  {
    method: 'POST',
    path: '/games',
    options: { handler: GameController.createMany }
  },
  {
    method: 'GET',
    path: '/game/{id}',
    options: { handler: GameController.retrieveOne }
  },
  {
    method: 'GET',
    path: '/games',
    options: { handler: GameController.retrieve }
  },
  {
    method: 'PATCH',
    path: '/game',
    options: { handler: GameController.setResult }
  }
];
