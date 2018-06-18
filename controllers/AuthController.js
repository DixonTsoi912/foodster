const jwt = require('jsonwebtoken');
const config = require('../configs/config.json');
const httpStatus = require('http-status-codes');

function authenticate(req, res, next) {
    var token = req.headers['x-access-token'];
    if(!token) {
        res.send({status: httpStatus.FORBIDDEN, auth: false, message: 'No token provide'});
    }
    jwt.verify(token, config.secret, function(err, decoded) {
        if(err) {
            res.send({status: httpStatus.INTERNAL_SERVER_ERROR, auth: false, message: 'Failed to authenticate'});
        }
        req.userId = decoded.id;
        next();
    })
}

module.exports = authenticate;