const {
  after, before, suite, test,
} = require('mocha');
const { assert } = require('chai');
const AppService = require('./app-service');
const fixtures = require('./fixtures');

const appService = new AppService(fixtures.AppService);
const user = fixtures.users[0];

const firstNameTooShort = 'a';
const firstNameTooLong = 'abcdefghijklmnopq';
const firstNameLowerBound = 'ab';
const firstNameUpperBound = 'abcdefghijklmnop';
const firstNameInvalidCharacter = 'ab&cd';
const firstNameAllValidCharacters = 'a\'bc-de';

const lastNameTooShort = 'a';
const lastNameTooLong = 'abcdefghijklmnopqrstuvwxyzABCDEFG';
const lastNameLowerBound = 'ab';
const lastNameUpperBound = 'abcdefghijklmnopqrstuvwxyzABCDEF';
const lastNameInvalidCharacter = '12AB';
const lastNameAllValidCharacters = 'A\'BC-DE';

const emailInvalidNoAt = 'xaty.z';
const emailValidCombination = 'x_1@y2.z.u';

const passwordTooShort = '1234567';
const passwordTooLong = '12345678901234567';
const passwordLowerBound = '123455678';
const passwordUpperBound = '1234567890123456';
const passwordWithSpace = '1234 5678';
const passwordWithTab = '1234\t5678';
const passwordWithReturn = '1234\n5678';
const passwordValidCharacterCombination = 'RTrt$%45';

suite('User API tests', () => {
  before(() => {
    appService.deleteAllUsers();
  });

  after(() => {
    appService.deleteAllUsers();
  });

  test('firstName', () => {
    user.firstName = firstNameTooShort;
    assert.isNull(appService.createUser(user));
    user.firstName = firstNameTooLong;
    assert.isNull(appService.createUser(user));
    user.firstName = firstNameLowerBound;
    assert.isNotNull(appService.createUser(user));
    user.firstName = firstNameUpperBound;
    assert.isNotNull(appService.createUser(user));
    user.firstName = firstNameInvalidCharacter;
    assert.isNull(appService.createUser(user));
    user.firstName = firstNameAllValidCharacters;
    assert.isNotNull(appService.createUser(user));
  });

  test('lastName', () => {
    user.lastName = lastNameTooShort;
    assert.isNull(appService.createUser(user));
    user.lastName = lastNameTooLong;
    assert.isNull(appService.createUser(user));
    user.lastName = lastNameLowerBound;
    assert.isNotNull(appService.createUser(user));
    user.lastName = lastNameUpperBound;
    assert.isNotNull(appService.createUser(user));
    user.lastName = lastNameInvalidCharacter;
    assert.isNull(appService.createUser(user));
    user.lastName = lastNameAllValidCharacters;
    assert.isNotNull(appService.createUser(user));
  });

  test('email', () => {
    user.email = emailInvalidNoAt;
    assert.isNull(appService.createUser(user));
    user.email = emailValidCombination;
    assert.isNotNull(appService.createUser(user));
  });

  test('password', () => {
    user.password = passwordTooShort;
    assert.isNull(appService.createUser(user));
    user.password = passwordTooLong;
    assert.isNull(appService.createUser(user));
    user.password = passwordLowerBound;
    assert.isNotNull(appService.createUser(user));
    user.password = passwordUpperBound;
    assert.isNotNull(appService.createUser(user));
    user.password = passwordWithSpace;
    assert.isNull(appService.createUser(user));
    user.password = passwordWithTab;
    assert.isNull(appService.createUser(user));
    user.password = passwordWithReturn;
    assert.isNull(appService.createUser(user));
    user.password = passwordValidCharacterCombination;
    assert.isNotNull(appService.createUser(user));
  });
});
