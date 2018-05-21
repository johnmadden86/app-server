const { after, before, beforeEach, suite, test } = require('mocha');
const { assert } = require('chai');
const AppService = require('../app-service');
const fixtures = require('./category-fixtures');

const { server, newPlayer, categoryId } = fixtures;
const appService = new AppService(server);
let id;

suite('Category API tests', () => {
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
    const category = await appService.getOneCategory(categoryId);
    assert.isDefined(category._id, category.__v);
    assert.containsAllKeys(category, ['name']);
  });
});
