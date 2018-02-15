'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dbURI = 'mongodb://localhost/app-server';

mongoose.connect(dbURI);

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
  if (process.env.NODE_ENV !== 'production') {
    // seedData();
  }
});
