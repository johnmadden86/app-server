require('make-promises-safe');
const Hapi = require('hapi');
const bell = require('bell');
const routes = require('require.all')('./routes');

const Auth = require('./api/controllers/auth-controller');
const axios = require('axios');
const fs = require('fs');

const start = async () => {
  const Server = Hapi.server({ host: 'localhost', port: 3000 });
  await Server.register(bell);
  Server.auth.scheme(Auth.schemeName, Auth.scheme);
  Server.auth.strategy(Auth.strategyName, Auth.schemeName);
  Server.auth.strategy('google', 'bell', Auth.googleOAuthOptions(Server));
  Server.auth.default(Auth.strategyName);

  // eslint-disable-next-line global-require
  require('./api/models/db');

  Server.route(routes.category);
  Server.route(routes.game);
  Server.route(routes.league);
  Server.route(routes.player);
  Server.route(routes.prediction);
  // Server.route(routes.score);
  Server.route(routes.team);
  Server.route(routes.tournament);

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
