var express = require('express');
var router = express.Router();
const main = require('../handlers/main');

router.get('/', main.uptime);

router.post('/signup', main.signUp);

router.post('/login', main.login);

module.exports = router;
