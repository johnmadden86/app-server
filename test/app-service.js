const HttpSync = require('./http-sync');
const queryString = require('querystring');

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

  createCategory(details) {
    return this.httpService.post(`/categories`, details);
  }

  getCategory(name) {
    return this.httpService.get(`/categories?name=${name}`);
  }

  deleteCategory(id) {
    return this.httpService.delete(`/categories/${id}`);
  }

  /* Team */

  createOneTeam(details) {
    return this.httpService.post(`/team`, details);
  }

  createManyTeams(json) {
    return this.httpService.post(`/teams`, json);
  }

  deleteOneTeam(id) {
    return this.httpService.delete(`/team/${id}`);
  }

  deleteManyTeams(details) {
    const query = queryString.stringify(details);
    return this.httpService.delete(`/teams?${query}`);
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
