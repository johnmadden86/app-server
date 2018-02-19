const Controller = require('./api/controllers/user-controller');

module.exports = [
  { method: 'GET', path: '/', handler() { return 'h3llo w0rld'; } },
  { method: 'POST', path: '/users', options: Controller.create },
  { method: 'GET', path: '/users/{id}', options: Controller.retrieveOne },
  // TODO { method: 'GET', path: '/users', options: Controller.retrieveMany },
  { method: 'GET', path: '/users', options: Controller.retrieveAll },
  { method: 'POST', path: '/users/{id}', options: Controller.update },
  { method: 'DELETE', path: '/users/{id}', options: Controller.deleteOne },
  // TODO { method: 'GET', path: '/users', options: Controller.deleteMany },
  { method: 'DELETE', path: '/users', options: Controller.deleteAll },
];
