const express = require('express');
const Core = require('../utils/core');
const Item = require('../models/item');

const router = express.Router();
const { getAll, getID } = Core(Item);

router.get('/', getAll);
router.get('/:id', getID);

module.exports = router;
