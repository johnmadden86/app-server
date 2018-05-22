const TeamController = require('../api/controllers/team-controller');

module.exports = [
  {
    method: 'GET',
    path: '/teams',
    options: { handler: TeamController.retrieveAll }
  }
];
