var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  models.user.findAll()
  .then(user => {
    res.send({
      users: user
    })
  }).error(err => {
    console.log(err);
  })
});

module.exports = router;
