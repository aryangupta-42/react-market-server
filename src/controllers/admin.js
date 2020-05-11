const express = require('express');
const Core = require('../utils/core');
const Admin = require('../models/admin');
const response = require('../helper/response');

const router = express.Router();
const { getID } = Core(Admin, true);

router.get('/', (req, res) => {
  res.status(200).json(response(true, 'User loaded successfully', req.user));
});

router.get('/:id', getID);

module.exports = router;
