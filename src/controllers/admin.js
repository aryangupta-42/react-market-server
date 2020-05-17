const express = require('express');
const Core = require('../utils/core');
const Admin = require('../models/admin');
const response = require('../helper/response');

const router = express.Router();
const { getID, create, getAll, deleteID } = Core(Admin, true);

router.get('/', (req, res) => {
    res.status(200).json(response(true, 'User loaded successfully', req.user));
});

router.get('/all', getAll);

router.get('/:id', getID);

router.post('/addAdmin', create);

router.post('/delete/:id', deleteID);

module.exports = router;
