const bcrypt = require('bcrypt');
const models = require('../models');

exports.getUserList = function(req , cb) {
    cb({result: 200});
}

exports.createUser = function(req, cb) {
    bcrypt.hash('testing1', 5, function(err, password) {
        if(!err) {
            models.user.create({
                email: 'dixon.tsoi@icw.io',
                password: password,
                name: 'Dixon'
            }).then(user => {
                cb({user: user})
            }).error(err => {
                console.log(err);
            })
        }
    });
}