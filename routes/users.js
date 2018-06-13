const express = require('express');
const router = express.Router();
const users = require('../handlers/user');

/* GET users listing. */
router.get('/', users.getUserList);

module.exports = router;
