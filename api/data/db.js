const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const local = 'localhost';

const dbURI = `mongodb://${local}/app-server`;

mongoose.connect(dbURI);

mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

mongoose.connection.on('connected', async () => {
  console.log(`Mongoose connected to ${dbURI}`);
});
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
