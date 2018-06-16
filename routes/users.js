const express = require('express');
const router = express.Router();
let user = require('../controllers/UserController');
const ensureAuthenticated = require('../controllers/AuthController');

/* GET users listing. */
router.get('/', ensureAuthenticated , user.getUserProfile);

router.post('/', ensureAuthenticated , user.updateUserProfile);

module.exports = router;
