'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = Hapi.server({
  // host: 'localhost',
  port: 3000
});

require('./db');
server.route(require('./routes'));

// Start the server
async function start() {

  try {
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
}

start();