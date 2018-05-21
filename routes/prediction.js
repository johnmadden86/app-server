const PredictionController = require('../api/controllers/prediction-controller');

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
    method: 'POST',
    path: '/predictions/resolve',
    options: { handler: PredictionController.resolve }
  },
  {
    method: 'POST',
    path: '/predictions/missed',
    options: { handler: PredictionController.missed }
  }
];
