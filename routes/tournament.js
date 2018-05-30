const TournamentController = require('../api/controllers/requests/tournament');

module.exports = [
  {
    method: 'POST',
    path: '/tournaments',
    options: { handler: TournamentController.create }
  },
  {
    method: 'GET',
    path: '/tournaments/{id}',
    options: { handler: TournamentController.retrieveOne }
  },
  {
    method: 'GET',
    path: '/tournaments',
    options: { handler: TournamentController.retrieveAll }
  },
  {
    method: 'DELETE',
    path: '/tournaments/{id}',
    options: { handler: TournamentController.delete }
  }
];
