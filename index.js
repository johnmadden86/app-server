require('make-promises-safe');
const Hapi = require('hapi');
const bell = require('bell');
const routes = require('./routes');
const Auth = require('./api/controllers/auth-controller');

const start = async () => {
  const Server = Hapi.server({ host: 'localhost', port: 3000 });
  await Server.register(bell);
  Server.auth.scheme(Auth.schemeName, Auth.scheme);
  Server.auth.strategy(Auth.strategyName, Auth.schemeName);
  Server.auth.strategy(
    /* strategy name */ 'google',
    /* scheme name */ 'bell',
    /* options */{
      provider: 'google',
      password: 'cookie_encryption_password_secure',
      isSecure: false,
      clientId: '228726651093-i6cogib8up91319cqrn03p784i0sti1d.apps.googleusercontent.com',
      clientSecret: '6aCyq6AwzQaOqGouwQValHxT',
      location: Server.info.uri,
    },
  );
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
