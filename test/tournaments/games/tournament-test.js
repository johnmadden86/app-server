const { before, beforeEach, suite, test } = require('mocha');
const { assert } = require('chai');
const AppService = require('./app-service');
const fixtures = require('./fixtures');

const appService = new AppService(fixtures.AppService);
const { details, validCategories, invalidCategories } = fixtures;
let catId;

suite('User API tests', () => {
  beforeEach(() => {
    appService.authenticate(details);
  });

  test('create valid', () => {
    const newCat = appService.create(validCategories[0]);
    assert.isDefined(newCat.category._id, newCat.category.__v);
    assert.containsAllKeys(newCat.category, ['name']);
    catId = newCat.category._id;
    console.log(catId);
  });

  test('create invalid', () => {
    const newCat = appService.create(invalidCategories[0]);
    assert.isNull(newCat);
  });

  test('retrieve one', () => {
    const category = appService.getOne(catId);
    console.log(category);
    assert.isDefined(category._id, category.__v);
    assert.containsAllKeys(category, ['name']);
  });

  test('retrieve all', () => {
    const allCats = appService.getAll();
    assert.equal(validCategories.length, allCats.length);
  });

  test('delete', async () => {
    appService.delete(catId);
    const allCats = await appService.getAll();
    assert.equal(allCats.length, validCategories.length - 1);
  });
});
