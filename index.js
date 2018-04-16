require('make-promises-safe');
const Hapi = require('hapi');
const bell = require('bell');
const routes = require('./routes');
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

  Server.route(routes);

  /*
  const { data } = await axios('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json');
  const json = JSON.stringify(data);
  try {
    fs.writeFile('/app/app-server/api/models/data.json', json, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  } catch (e) {
    console.log(e);
  }
  */

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
