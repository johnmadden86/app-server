const { after, before, beforeEach, suite, test } = require('mocha');
const { assert } = require('chai');
const AppService = require('./app-service');
const Helpers = require('../api/controllers/helpers/category');
const fixtures = require('./fixtures');

const { server, players, categoryNames } = fixtures;
const appService = new AppService(server);
let playerId;
let categoryId;

suite('Category API tests', () => {
  before(async () => {
    const response = await appService.createPlayer(players[0]);
    playerId = response.player._id;
  });

  beforeEach(() => {
    appService.authenticate(players[0]);
  });

  after(() => {
    appService.authenticate(players[0]);
    // auth required for deletion
    appService.deleteOnePlayer(playerId);
  });

  test('create', async () => {
    const category = await appService.createCategory({
      name: categoryNames[0]
    });
    categoryId = category._id;
    assert.isDefined(category._id, category.__v);
    assert.containsAllKeys(category, ['name']);
  });

  test('get', async () => {
    const category = await appService.getCategory(categoryNames[1]);
    assert.isDefined(category._id, category.__v);
    assert.containsAllKeys(category, ['name']);
  });

  test('delete', async () => {
    const category = await appService.deleteCategory(categoryId);
    assert.equal(category, 200);
  });
});
