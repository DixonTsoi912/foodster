const authController = require('../controllers/MainController');
const child = require('child_process');

exports.uptime = function(req, res) {
    child.exec('uptime', function (err, stdout, stderr) {
        if(!err) {
            res.send({status: 200, result: stdout});
        } else {
            res.send({status: 500, err: err});
        }
    });
}

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