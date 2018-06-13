var express = require('express');
var router = express.Router();
var users = require('../handlers/user');

/* GET users listing. */
router.get('/', users.getUserList);

module.exports = router;
