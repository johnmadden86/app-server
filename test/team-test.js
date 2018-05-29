const { after, before, beforeEach, suite, test } = require('mocha');
const { assert } = require('chai');
const AppService = require('./app-service');
const fixtures = require('./fixtures');

const { server, players, categoryNames, teams } = fixtures;
const keys = Object.keys(teams[0]);
const appService = new AppService(server);
let playerId;
let teamId;
let teamIds;

suite('Team API tests', () => {
  before(async () => {
    const response = await appService.createPlayer(players[0]);
    playerId = response.player._id;
    appService.authenticate(players[0]);
  });

  beforeEach(() => {
    appService.authenticate(players[0]);
  });

  after(() => {
    appService.authenticate(players[0]);
    appService.deleteOnePlayer(playerId);
  });

  test('create one', async () => {
    const team = await appService.createOneTeam({
      category: categoryNames[1],
      team: teams[0]
    });
    assert.isDefined(team._id, team.__v);
    assert.containsAllKeys(team, keys);
    teamId = team._id;
  });

  test('create many', async () => {
    const upload = {
      category: categoryNames[1],
      teams: teams.filter(team => teams.indexOf(team) > 0)
    };
    const response = await appService.createManyTeams({ upload });
    const { result, ops, insertedCount, insertedIds } = response;
    assert.equal(result.ok, 1);
    assert.equal(result.n, upload.teams.length);
    assert.equal(insertedCount, upload.teams.length);
    ops.forEach(team => {
      assert.isDefined(team._id);
      assert.containsAllKeys(team, keys);
    });
    teamIds = insertedIds;
  });

  test('delete one', async () => {
    const category = await appService.deleteOneTeam(teamId);
    assert.equal(category, 200);
  });

  test('delete many', async () => {
    const category = await appService.deleteManyTeams(teamIds);
    assert.equal(category, 200);
  });
});
