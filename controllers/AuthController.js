const jwt = require('jsonwebtoken');
const config = require('../configs/config.json');

function authenticate(req, res, next) {
    var token = req.headers['x-access-token'];
    if(!token) {
        res.send({status: 403, auth: false, message: 'No token provide'});
    }
    jwt.verify(token, config.secret, function(err, decoded) {
        if(err) {
            res.send({status: 500, auth: false, message: 'Failed to authenticate'});
        }
        req.userId = decoded.id;
        next();
    })
}

module.exports = authenticate;