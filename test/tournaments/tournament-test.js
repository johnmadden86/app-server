const { after, before, beforeEach, suite, test } = require('mocha');
const { assert } = require('chai');
const AppService = require('../app-service');
const fixtures = require('./tournament-fixtures');

const { server, newPlayer, tournamentId } = fixtures;
const appService = new AppService(server);
let id;

suite('Tournament API tests', () => {
  before(async () => {
    await appService.createPlayer(newPlayer);
  });

  beforeEach(() => {
    appService.authenticate(newPlayer);
  });

  after(() => {
    appService.authenticate(newPlayer);
    // auth required for deletion
    appService.deleteOnePlayer(id);
  });

  test('create', async () => {
    const tournament = await appService.getOneTournament(tournamentId);
    assert.isDefined(tournament._id, tournament.__v);
    assert.containsAllKeys(tournament, ['name', 'active', 'category', 'games']);
  });
});
