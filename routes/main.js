const express = require('express');
const router = express.Router();
const main = require('../controllers/MainController');

router.get('/', main.uptime);

router.post('/signup', main.signup);

router.post('/login', main.login);

module.exports = router;
