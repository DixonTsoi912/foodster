const express = require('express');
const router = express.Router();
const main = require('../controllers/MainController');
const ensureAuthenticated = require('../controllers/AuthController');

router.get('/', main.uptime);

router.post('/signup', main.signup);

router.post('/login', main.login);

router.post('/resetPassword', ensureAuthenticated, main.createResetPasswordToken);

module.exports = router;
