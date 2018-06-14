const express = require('express');
const router = express.Router();
const users = require('../handlers/user');
const ensureAuthenticated = require('../controllers/AuthController');

/* GET users listing. */
router.get('/:id', ensureAuthenticated , users.getUserProfile);

router.post('/', ensureAuthenticated , users.updateUserProfile);

module.exports = router;
