const Controller = require('./controller');

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function (request, h) { return 'h3llo w0rld'; }
  },
  {
    method: 'GET',
    path: '/users',
    config: Controller.findAll
  },
  {
    method: 'POST',
    path: '/users',
    config: Controller.addNew
  },

];
