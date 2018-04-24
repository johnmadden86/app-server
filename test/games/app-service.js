const HttpSync = require("../http-sync");
const fixtures = require("../tournaments/fixtures.json");

const baseUrl = fixtures.AppService;

class AppService {
  constructor() {
    this.httpService = new HttpSync(baseUrl);
  }

  authenticate(details) {
    return this.httpService.setAuth("/", details);
  }

  logout() {
    this.httpService.clearAuth();
  }

  create(newCategory) {
    return this.httpService.post("/categories", newCategory);
  }

  getOne(id) {
    return this.httpService.get(`/categories/${id}`);
  }

  getAll() {
    return this.httpService.get("/categories");
  }

  delete(id) {
    return this.httpService.delete(`/categories/${id}`);
  }
}

module.exports = AppService;
