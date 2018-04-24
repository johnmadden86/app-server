const { after, suite, test } = require("mocha");
const { assert } = require("chai");
const AppService = require("./app-service");
const fixtures = require("./sign-in-fixtures");

const { server, newPlayer, noSuchPlayer, incorrectPassword } = fixtures;
const appService = new AppService(server);
let id;

suite("Sign-in API tests", () => {
  after(() => {
    appService.authenticate(newPlayer);
    // auth required for deletion
    appService.deleteOne(id);
  });

  test("create", async () => {
    const { player } = await appService.create(newPlayer);
    id = player._id;
    assert.isDefined(player._id, player.__v);
    assert.containsAllKeys(player, [
      "firstName",
      "lastName",
      "email",
      "password"
    ]);
  });

  test("login", async () => {
    const reply = await appService.login(newPlayer);
    assert.isTrue(reply.success);
    assert.isDefined(reply.token);
  });

  test("login no such player", async () => {
    const reply = await appService.login(noSuchPlayer);
    assert.isNotTrue(reply.success);
    assert.include(reply.message, "Not Found");
  });

  test("login incorrect password", async () => {
    const reply = await appService.login(incorrectPassword);
    assert.isNotTrue(reply.success);
    assert.include(reply.message, "Incorrect Password");
  });
});
