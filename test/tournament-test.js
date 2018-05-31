const { after, before, beforeEach, suite, test } = require('mocha');
const { assert } = require('chai');
const AppService = require('./app-service');
const fixtures = require('./fixtures');
const Helper = require('../api/controllers/helpers/tournament');

const { server, players, newTournament, categoryNames } = fixtures;
const newPlayer = players[0];
const appService = new AppService(server);
let playerId;
let newTournamentId;
const keys = [
  'name',
  'active',
  'category',
  'events',
  'eventsComplete',
  'logoUrl'
];

suite('Tournament API tests', () => {
  before(async () => {
    const player = await appService.createPlayer(newPlayer);
    playerId = player._id;
  });

  beforeEach(() => {
    appService.authenticate(newPlayer);
  });

  after(() => {
    appService.authenticate(newPlayer);
    // auth required for deletion
    appService.deleteTournament(newTournamentId);
    appService.deleteOnePlayer(playerId);
  });

  test('create', async () => {
    const category = await appService.getCategory(categoryNames[1]);
    newTournament.category = category._id;
    const tournament = await appService.createTournament(newTournament);
    assert.isDefined(tournament._id, tournament.__v);
    assert.containsAllKeys(tournament, keys);
    newTournamentId = tournament._id;
  });

  test('get one', async () => {
    const tournament = await appService.getOneTournament(newTournamentId);
    assert.isDefined(tournament._id, tournament.__v);
    assert.containsAllKeys(tournament, keys);
  });
});
