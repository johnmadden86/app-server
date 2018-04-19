const mongoose = require('mongoose');
const seeder = require('mongoose-seed');

const data = require('../data/game-data');

mongoose.Promise = global.Promise;

const docker = 'mongo';
const local = 'localhost';

const dbURI = `mongodb://${local}/app-server`;

mongoose.connect(dbURI);

// mongoose.connect(MongoDBUrl, {})
//  .then(() => { console.log('Connected to Mongo server'); }, (err) => { console.log(err); });

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

mongoose.connection.on('connected', async () => {
  console.log(`Mongoose connected to ${dbURI}`);
  if (process.env.NODE_ENV !== 'production') {
    /*
    seeder.connect(dbURI, () => {
      seeder.loadModels([
        'api/models/player-model',
        'api/models/league-model',
        'api/models/game-model',
        'api/models/prediction-model',
      ]);
      seeder.clearModels(['Player', 'League', 'Game', 'Prediction'], () => {
        seeder.populateModels(data, () => {
          seeder.disconnect();
        });
      });
    });
    */
  }
});

