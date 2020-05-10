/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const dotenv = require('dotenv');
const fs = require('fs');
const compression = require('compression'); // compresses requests
const bodyParser = require('body-parser');
const lusca = require('lusca');
const cors = require('cors');
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

app.use(cors());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));


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

require('./src/helper/auth')(passport);

const response = require('./src/helper/response');
const Admin = require('./src/models/admin');

const serverErrMessage = 'An internal error occurred, Please try again later';

app.post('/login', async (req, res) => {
  const {
    username,
    password,
  } = req.body;
  try {
    const searchRes = await Admin.findOne({ username });
    if (!searchRes.username) {
      res.status(403).json(response(false, 'Whoops!! No such user exists.', null));
    } else {
      const access = await searchRes.comparePasswords(password);
      if (!access) {
        res.status(403).json(response(false, 'Whoops!! You\'ve entered the wrong password', null));
      } else {
        const admin = {
          id: searchRes.id,
          name: searchRes.name,
          username: searchRes.username,
          access: searchRes.access,
        };
        const token = jwt.sign(admin, secret, {
          expiresIn: 604800,
        });
        const jsonData = {
          admin,
          token: `JWT ${token}`,
        };
        res.status(200).json(response(true, 'Login successful', jsonData));
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(response(false, serverErrMessage, null));
  }
});

app.get('/', (_, res) => {
  res.json(response(true, 'arrived at home page', null));
});

app.get('/getUserDetails', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(req.user);
});

const itemRouter = require('./src/controllers/item');
const adminRouter = require('./src/controllers/admin');

const apiRouter = express.Router();

// SUB ROUTER
apiRouter.use('/items', itemRouter);
apiRouter.use('/admin', passport.authenticate('jwt', { session: false }), adminRouter);
// APP ROUTER
app.use('/api', apiRouter);

// INITIAL SETUP ROUTES ------------

app.get('/initial/sudo/createSuperAdmin', async (_, res) => {
  const admin = new Admin({
    name: 'Aryan Gupta',
    username: 'aryangupta',
    password: 'helloworld',
    access: 'superadmin',
  });
  try {
    await admin.save();
    res.status(201).json(response(true, 'Admin created Successfully', admin));
  } catch (err) {
    console.log(err);
    // err.code = 110000 => duplicate username
    // err.errors.access.kind => enum
    res.status(500).json(response(false, 'an error occ', null));
  }
});

// SETUP APP LISTEN
app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Server started on %s', process.env.PORT);
});
