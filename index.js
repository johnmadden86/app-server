require('make-promises-safe');
const Hapi = require('hapi');
const routes = require('./routes');
const Auth = require('./api/controllers/auth-controller');

const Server = Hapi.server({ host: 'localhost', port: 3000 });

const start = async () => {
  Server.auth.scheme(Auth.schemeName, Auth.scheme);
  Server.auth.strategy(Auth.strategyName, Auth.schemeName);
  Server.auth.default(Auth.strategyName);

  // eslint-disable-next-line global-require
  require('./api/models/db');

  Server.route(routes);

  await Server.start();
  return Server;
};

start()
  .then((server) => {
    console.log(`Server running at: ${server.info.uri}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

