const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const seeder = require('mongoose-seeder');
// const data = require('./seed-data');

const local = 'localhost';

const dbURI = `mongodb://${local}/app-server`;

// noinspection JSIgnoredPromiseFromCall
mongoose.connect(dbURI);

mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

mongoose.connection.on('connected', async () => {
  console.log(`Mongoose connected to ${dbURI}`);
  // console.log(seeder.seed);
  /*
  try {
    const dbData = await seeder.seed({}, {}, () => {});
    console.log(dbData);
  } catch (e) {
    throw e;
  }
  */
});
