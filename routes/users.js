const express = require('express');
const router = express.Router();
const users = require('../handlers/user');
const ensureAuthenticated = require('../controllers/AuthController');

/* GET users listing. */
router.get('/', ensureAuthenticated , users.getUserList);

module.exports = router;
