const { after, before, beforeEach, suite, test } = require('mocha');
const { assert } = require('chai');
const AppService = require('./app-service');
const fixtures = require('./fixtures');

const { server, players, newTournament, tournamentId } = fixtures;
const newPlayer = players[0];
const appService = new AppService(server);
let playerId;
let newTournamentId;

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

  test('get one', async () => {
    const tournament = await appService.getOneTournament(tournamentId);
    assert.isDefined(tournament._id, tournament.__v);
    assert.containsAllKeys(tournament, ['name', 'active', 'category']);
  });

  test('create', async () => {
    const tournament = await appService.createTournament(newTournament);
    assert.isDefined(tournament._id, tournament.__v);
    assert.containsAllKeys(tournament, ['name', 'active', 'category']);
    newTournamentId = tournament._id;
  });
});
