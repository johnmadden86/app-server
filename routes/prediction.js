const PredictionController = require('../api/controllers/requests/prediction');

module.exports = [
  {
    method: 'POST',
    path: '/predictions',
    options: { handler: PredictionController.createOrUpdate }
  },
  {
    method: 'GET',
    path: '/predictions',
    options: { handler: PredictionController.retrieve }
  },
  {
    method: 'GET',
    path: '/prediction/{game}',
    options: { handler: PredictionController.retrieveOne }
  }
];
