const Hapi = require('hapi');

const start = async () => {
  const Server = Hapi.server({ host: 'localhost', port: 3000 });
  await Server.start();
  // eslint-disable-next-line global-require
  require('./api/data/db');
  return Server;
};

start()
  .then(server => {
    console.log(`Server running at: ${server.info.uri}`);
  })
  .catch(err => {
    throw err;
  });
