const ScoreController = require('../api/controllers/requests/score');

module.exports = [
  {
    method: 'GET',
    path: '/enter',
    options: { handler: ScoreController.createOrRetrieve }
  },
  {
    method: 'GET',
    path: '/enter-all',
    options: { handler: ScoreController.createOrRetrieveForAll }
  }
];
