{
  method: 'GET',
    path: '/seed-teams',
  options: { handler: DataController.addTeams },
},
{
  method: 'GET',
    path: '/tournaments/teams',
  options: { handler: DataController.addQualifiedTeams },
},
{
  method: 'GET',
    path: '/tournaments/games',
  options: { handler: DataController.addGames },
},
const DataController = require('../api/controllers/data-controller');

module.exports = [
];
