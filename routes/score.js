const ScoreController = require('../api/controllers/score-controller');

module.exports = [
  {
    method: 'GET',
    path: '/enter',
    options: { handler: ScoreController.createOrRetrieve }
  }
];
