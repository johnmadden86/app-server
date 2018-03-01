const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const docker = 'mongo';
const local = 'localhost';

const dbURI = `mongodb://${local}/app-server`;

mongoose.connect(dbURI);
//mongoose.connect(MongoDBUrl, {})
//  .then(() => { console.log('Connected to Mongo server'); }, (err) => { console.log(err); });

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
  if (process.env.NODE_ENV !== 'production') {
    // seedData();
  }
});
