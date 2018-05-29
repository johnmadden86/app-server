const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const local = 'localhost';

const dbURI = `mongodb://${local}/app-server`;

mongoose.connect(dbURI).then(() => { console.log('Connected to Mongo server'); }, (err) => { console.log(err); });

mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

mongoose.connection.on('connected', async () => {
  console.log(`Mongoose connected to ${dbURI}`);
});
