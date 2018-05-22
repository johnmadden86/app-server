const TeamController = require('../api/controllers/team-controller');

module.exports = [
  {
    method: 'GET',
    path: '/teams/insert',
    options: { handler: TeamController.insert }
  }
];
