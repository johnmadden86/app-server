const LeagueController = require('../api/controllers/requests/league-controller');
const Validate = require('../api/controllers/requests/input-validation');

module.exports = [
  {
    method: 'POST',
    path: '/leagues',
    options: {
      handler: LeagueController.create,
      validate: Validate.league
    }
  },
  {
    method: 'GET',
    path: '/leagues/{id}',
    options: { handler: LeagueController.retrieveOne }
  },
  {
    method: 'GET',
    path: '/leagues',
    options: { handler: LeagueController.retrieveAll }
  },
  {
    method: 'GET',
    path: '/players/{id}/leagues',
    options: { handler: LeagueController.retrieveAllForPlayer }
  },
  {
    method: 'GET',
    path: '/tournaments/{id}/leagues',
    options: { handler: LeagueController.retrieveAllForTournament }
  },
  {
    method: 'POST',
    path: '/leagues/{id}',
    options: {
      handler: LeagueController.update,
      validate: Validate.league
    }
  },
  {
    method: 'DELETE',
    path: '/leagues/{id}',
    options: { handler: LeagueController.deleteOne }
  },
  {
    method: 'DELETE',
    path: '/leagues',
    options: { handler: LeagueController.deleteAll }
  },
  {
    method: 'POST',
    path: '/leagues/join',
    options: { handler: LeagueController.joinLeague }
  },
  {
    method: 'GET',
    path: '/leagues/{id}/leave',
    options: { handler: LeagueController.leaveLeague }
  },
  {
    method: 'GET',
    path: '/leagues/update',
    options: { handler: LeagueController.updateTable }
  }
];
