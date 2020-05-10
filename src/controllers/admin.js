const express = require('express');
const Core = require('../utils/core');
const Admin = require('../models/admin');

const router = express.Router();
const { getAll, getID } = Core(Admin, true);

router.get('/', getAll);
router.get('/:id', getID);

module.exports = router;
