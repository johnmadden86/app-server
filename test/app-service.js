const HttpSync = require('./http-sync');
const fixtures = require('./fixtures.json');

const baseUrl = fixtures.AppService;

class AppService {
  constructor() {
    this.httpService = new HttpSync(baseUrl);
  }

  createUser(newUser) {
    return this.httpService.post('/users', newUser);
  }

  getOneUser(id) {
    return this.httpService.get(`/users/${id}`);
  }

  getAllUsers() {
    return this.httpService.get('/users');
  }

  updateUser(id, newDetails) {
    return this.httpService.post(`/users/${id}`, newDetails);
  }

  deleteOneUser(id) {
    return this.httpService.delete(`/users/${id}`);
  }

  deleteAllUsers() {
    return this.httpService.delete('/users');
  }
}

module.exports = AppService;
