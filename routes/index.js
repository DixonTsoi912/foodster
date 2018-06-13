var express = require('express');
var router = express.Router();
const index = require('../handlers/index');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', index.signUp);

router.post('/login', index.login);
module.exports = router;
