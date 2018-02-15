const Controller = require('./controller');

module.exports = [
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
