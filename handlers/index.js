let authController = require('../controllers/AuthController');

exports.signUp = function(req, res) {
    authController.signup(req, result => {
        res.send(result);
    })
}

exports.login = function(req, res) {
    authController.login(req, result => {
        res.send(result);
    })
}