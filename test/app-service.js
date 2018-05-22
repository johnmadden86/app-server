const HttpSync = require('./http-sync');

class AppService {
  constructor(baseUrl) {
    this.httpService = new HttpSync(baseUrl);
  }

  /* Auth / Sign-in */

  authenticate(details) {
    return this.httpService.setAuth('/', details);
  }

  login(details) {
    return this.httpService.post('/', details);
  }

  logout() {
    this.httpService.clearAuth();
  }

  /* Player */

  createPlayer(newPlayer) {
    return this.httpService.post('/players', newPlayer);
  }

  getOnePlayer(id) {
    return this.httpService.get(`/players/${id}`);
  }

  getAllPlayers() {
    return this.httpService.get('/players');
  }

  updatePlayer(id, newDetails) {
    return this.httpService.post(`/players/${id}`, newDetails);
  }

  deleteOnePlayer(id) {
    return this.httpService.delete(`/players/${id}`);
  }

  deleteAllPlayers() {
    return this.httpService.delete('/players');
  }

  /* Category */

  getOneCategory(id) {
    return this.httpService.get(`/categories/${id}`);
  }

  /* Tournament */

  getOneTournament(id) {
    return this.httpService.get(`/tournaments/${id}`);
  }

  createTournament(details) {
    return this.httpService.post(`/tournaments`, details);
  }

  deleteTournament(id) {
    return this.httpService.delete(`/tournaments/${id}`);
  }
}

module.exports = AppService;
