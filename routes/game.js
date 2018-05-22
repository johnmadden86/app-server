const GameController = require('../api/controllers/game-controller');

module.exports = [
  {
    method: 'POST',
    path: '/games',
    options: { handler: GameController.create }
  },
  {
    method: 'GET',
    path: '/games',
    options: { handler: GameController.retrieve }
  },
  {
    method: 'POST',
    path: '/games/result',
    options: { handler: GameController.setResult }
  },
  {
    method: 'POST',
    path: '/games/fixture',
    options: { handler: GameController.updateFixture }
  },
  {
    method: 'GET',
    path: '/games/insert',
    options: { handler: GameController.insert }
  }
];
