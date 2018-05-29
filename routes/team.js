const TeamController = require('../api/controllers/team-controller');

module.exports = [
  {
    method: 'POST',
    path: '/team',
    options: { handler: TeamController.createOne }
  },
  {
    method: 'POST',
    path: '/teams',
    options: { handler: TeamController.createMany }
  },
  {
    method: 'DELETE',
    path: '/team/{id}',
    options: { handler: TeamController.deleteOne }
  },
  {
    method: 'DELETE',
    path: '/teams',
    options: { handler: TeamController.deleteMany }
  }
];
