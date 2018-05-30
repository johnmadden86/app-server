const { after, before, beforeEach, suite, test } = require('mocha');
const { assert } = require('chai');
const AppService = require('./app-service');
const fixtures = require('./fixtures');

const { server, players } = fixtures;
const newPlayer = players[0];
const appService = new AppService(server);
let playerId;

suite('Game API tests', () => {
  before(async () => {
    const player = await appService.createPlayer(newPlayer);
    playerId = player._id;
  });

  beforeEach(() => {
    appService.authenticate(newPlayer);
  });

  after(() => {});

  test('create one', async () => {});

  test('create many', async () => {});

  test('get one', async () => {});

  test('get by filter', async () => {});

  test('set result', async () => {});
});
