const ScoreController = require('../api/controllers/score-controller');

module.exports = [
  {
    method: 'POST',
    path: '/scores',
    options: { handler: ScoreController.create },
  },
];
