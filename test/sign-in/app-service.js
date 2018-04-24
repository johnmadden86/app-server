const HttpSync = require("../http-sync");
const fixtures = require("./sign-in-fixtures");

const baseUrl = fixtures.server;

class AppService {
  constructor() {
    this.httpService = new HttpSync(baseUrl);
  }

  login(details) {
    return this.httpService.post("/", details);
  }

  authenticate(details) {
    return this.httpService.setAuth("/", details);
  }

  logout() {
    this.httpService.clearAuth();
  }

  create(newPlayer) {
    return this.httpService.post("/players", newPlayer);
  }

  deleteOne(id) {
    return this.httpService.delete(`/players/${id}`);
  }
}

module.exports = AppService;
