let userController = require('../controllers/userController.js');

exports.getUserList = function(req, res) {
    userController.getUserList(req, result => {
        res.send(result);
    })
}