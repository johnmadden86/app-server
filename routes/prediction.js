const PredictionController = require('../api/controllers/prediction-controller');

module.exports = [{
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
}];
