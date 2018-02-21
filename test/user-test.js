/* eslint-disable no-underscore-dangle */
const { before, suite, test } = require('mocha');
const { assert } = require('chai');
const bCrypt = require('bcrypt');
const AppService = require('./app-service');
const fixtures = require('./fixtures');

const appService = new AppService(fixtures.AppService);
const { users } = fixtures;
const { newDetails } = fixtures;
const userIds = {};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

suite('User API tests', () => {
  before(() => {
    appService.deleteAllUsers();
  });

  test('create', () => {
    users.forEach((user, index) => {
      const newUser = appService.createUser(user);
      assert.isDefined(newUser._id, newUser.__v);
      assert.containsAllKeys(newUser, ['firstName', 'lastName', 'email', 'hash']);
      userIds[index] = newUser._id;
    });
  });

  test('retrieve one', () => {
    users.forEach((user, index) => {
      const registeredUser = appService.getOneUser(userIds[index]);
      assert.equal(registeredUser.firstName, users[index].firstName);
      assert.equal(registeredUser.lastName, users[index].lastName);
      assert.equal(registeredUser.email, users[index].email);
      bCrypt.compare(user.hash, registeredUser.hash, (err, isValid) => {
        assert.isTrue(isValid);
      });
    });
  });

  test('retrieve all', () => {
    const usersWithoutPasswords = users;
    for (let i = 0; i < usersWithoutPasswords.length; i += 1) {
      delete usersWithoutPasswords[i].hash;
    }
    const allUsers = appService.getAllUsers();
    assert.equal(allUsers.length, users.length);
    for (let i = 0; i < allUsers.length; i += 1) {
      delete allUsers[i]._id;
      delete allUsers[i].__v;
      delete allUsers[i].hash;
    }
    assert.sameDeepMembers(allUsers, usersWithoutPasswords);
  });

  test('update', () => {
    const i = getRandomInt(users.length);
    const oldUser = appService.getOneUser(userIds[i]);
    appService.updateUser(userIds[i], newDetails);
    const newUser = appService.getOneUser(userIds[i]);
    assert.notDeepEqual(newUser, oldUser);
    assert.notInclude(newUser, users[i]);
    users[i] = newDetails;
    delete newUser.hash;
    delete newDetails.hash;
    assert.include(newUser, newDetails);
  });

  test('delete one', () => {
    const i = getRandomInt(users.length);
    let allUsers = appService.getAllUsers();
    assert.equal(allUsers.length, users.length);
    appService.deleteOneUser(userIds[i]);
    allUsers = appService.getAllUsers();
    for (let j = 0; j < allUsers.length; j += 1) {
      assert.notInclude(allUsers[j], users[i]);
    }
  });

  test('delete all', () => {
    let allUsers = appService.getAllUsers();
    assert.isNotEmpty(allUsers);
    appService.deleteAllUsers();
    allUsers = appService.getAllUsers();
    assert.isEmpty(allUsers);
  });
});
