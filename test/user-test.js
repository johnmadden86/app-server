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
      const newUser = appService.createUser(user).user;
      assert.isDefined(newUser._id, newUser.__v);
      assert.containsAllKeys(newUser, ['firstName', 'lastName', 'email', 'password']);
      userIds[index] = newUser._id;
    });
  });

  test('authenticate', () => {
    const i = getRandomInt(users.length);
    const details = {
      email: users[i].email,
      password: users[i].password,
    };
    assert.isNull(appService.getAllUsers());
    appService.authenticate(details);
    assert.isNotNull(appService.getAllUsers());
  });

  test('retrieve one', () => {
    users.forEach((user, index) => {
      const registeredUser = appService.getOneUser(userIds[index]);
      assert.equal(registeredUser.firstName, users[index].firstName);
      assert.equal(registeredUser.lastName, users[index].lastName);
      assert.equal(registeredUser.email, users[index].email);
      bCrypt.compare(user.password, registeredUser.password, (err, isValid) => {
        assert.isTrue(isValid);
      });
    });
  });

  test('retrieve all', () => {
    const allUsers = appService.getAllUsers();
    assert.equal(allUsers.length, users.length);
    for (let i = 0; i < allUsers.length; i += 1) {
      delete allUsers[i]._id;
      delete allUsers[i].__v;
      delete allUsers[i].password;
    }
    const usersWithoutPasswords = JSON.parse(JSON.stringify(users));
    for (let i = 0; i < usersWithoutPasswords.length; i += 1) {
      delete usersWithoutPasswords[i].password;
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
    Object.assign(users[i], newDetails);
    delete newUser.password;
    delete newDetails.password;
    assert.include(newUser, newDetails);
  });

  test('delete one', () => {
    const i = getRandomInt(users.length);
    let j = i;
    while (j === i) {
      j = getRandomInt(users.length);
    }
    const details = {
      email: users[i].email,
      password: users[i].password,
    };
    appService.logout();
    appService.authenticate(details);
    appService.deleteOneUser(userIds[j]);
    const allUsers = appService.getAllUsers();
    assert.equal(allUsers.length, users.length - 1);
    for (let k = 0; k < allUsers.length; k += 1) {
      assert.notEqual(allUsers[k].email, users[j].email);
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
