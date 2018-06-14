let userController = require('../controllers/UserController');

exports.getUserProfile = function(req, res) {
    userController.getUserProfile(req, result => {
        res.send(result);
    })
}

exports.updateUserProfile = function(req, res) {
    userController.updateUserProfile(req, result => {
        res.send(result);
    })
}
