let userController = require('../controllers/UserController');

exports.getUserList = function(req, res) {
    userController.getUserList(req, result => {
        res.send(result);
    })
}

