const Hapi = require('hapi');
const routes = require('./routes');
const utils = require('./api/controllers/auth-controller');


const hapiAuthJWT = require('hapi-auth-jwt2');
const jwksRsa = require('jwks-rsa');

const server = new Hapi.Server({
  port: 3000,
  host: 'localhost',
});

const validateUser = (decoded, request, callback) => {
  // This is a simple check that the `sub` claim
  // exists in the access token. Modify it to suit
  // the needs of your application
  console.log('Decoded', decoded);
  if (decoded && decoded.sub) {
    return callback(null, true, {});
  }

  return callback(null, false, {});
};

require('./api/models/db');

const registerRoutes = () => {
  server.route(routes);
};

const init = async () => {
  await server.register(hapiAuthJWT);
  // see: http://Hapi.com/api#serverauthschemename-scheme

  const scheme = function (server, options) {

    return {
      api: {
        settings: {
          x: 5
        }
      },
      authenticate: function (request, h) {

        const authorization = request.headers.authorization;
        if (!authorization) {
          throw Boom.unauthorized(null, 'Custom');
        }

        return h.authenticated{ credentials: { user: 'john' } });
}
};
};

  server.auth.api;
  server.auth.scheme;
  server.auth.api.scheme;

  registerRoutes();

  await server.start();
  return server;
};

init().then((s) => {
  console.log('Server running at:', s.info.uri);
}).catch((e) => {
  console.log(e);
});
