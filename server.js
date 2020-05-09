/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const dotenv = require('dotenv');
const fs = require('fs');
const compression = require('compression'); // compresses requests
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');

if (fs.existsSync('.env')) {
  console.log('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  console.log('Please create a .env file for environment variables');
}


const express = require('express');

const app = express();
const mongoose = require('mongoose');


// eslint-disable-next-line no-unused-vars
const secret = process.env.SECRET;

// CONNECT TO MONGODB
const MONGODB_URI = process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/market';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to mongoDB');
  }).catch((err) => {
    console.log(err);
  });

// SETUP APP MIDDLEWARE (BODYPARSER AND COMPRESSION)
app.use(compression());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
require('./src/helper/auth')(passport);

const response = require('./src/helper/response');

app.get('/', (_, res) => {
  res.json(response(true, 'arrived at home page', null));
});


// SETUP APP LISTEN
app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Server started on %s', process.env.PORT);
});
