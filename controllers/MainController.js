const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config  = require('../configs/config.json');
const moment = require('moment');
const Promise = require('promise');
const validator = require("email-validator");
const child = require('child_process');
const httpStatus = require('http-status-codes');

exports.uptime = function(req, res) {
    child.exec('uptime', function (error, stdout, stderr) {
       res.send({status: httpStatus.OK, uptime: stdout});
    });
}
exports.signup = function(req, res) {
    var email = req.body.email.trim();
    var password = req.body.password.trim();
    var lastLogin = moment().format('YYYY-MM-DD  h:mm:ss');
    var checkUser = function() {
        return new Promise(function(resolve, reject) {
            if(validator.validate(email) && password) {
                models.user.findAll({
                    where:{
                        email: email
                    },
                    attributes: ['id']
                }).then(user => {
                    if(user.length > 0) {
                        reject({status: 409})
                    } else {
                        resolve();
                    }
                }).error(err => {
                    reject({status: httpStatus.INTERNAL_SERVER_ERROR, err: err});
                })
            } else {
                reject({status: httpStatus.INTERNAL_SERVER_ERROR});
            }
        })
    }
    var createUser = function() {
        return new Promise(function(resolve, reject) {
            if(email && password) {
                var hashedPassword = bcrypt.hashSync(password, 8);
                var roleId = (config['role'][req.body.role]) ? config['role'][req.body.role] : config['role']['user'];
                models.user.create({
                    email: email,
                    password: hashedPassword,
                    lastLogin: lastLogin,
                    isActivated: false,
                    roleId: roleId
                }).then(user => {
                    // create a token
                    var token = jwt.sign({ id: user.id }, config.secret);
                    resolve({ auth: true, token: token, status: httpStatus.OK });
                }).error(err => {
                    reject(err);
                });
            } else {
                resolve({auth: false, status: 400});
            }
        });
    };
    checkUser().then(function(){
        return createUser();
    }).then(function(result){
        res.status(httpStatus.OK).send({result: result});
    }).catch(function(err){
        res.send({status: httpStatus.INTERNAL_SERVER_ERROR, err});
    })
}

exports.login = function(req, res) {
    var email = req.body.email.trim();
    var password = req.body.password.trim();
    var lastLogin = moment().format('YYYY-MM-DD  h:mm:ss');

    var checkValue = function() {
        return new Promise(function(resolve, reject){
            if(email && password) {
                resolve();
            } else {
                reject({status: httpStatus.INTERNAL_SERVER_ERROR})
            }
        });
    }

    var checkUser = function() {
        return new Promise(function(resolve, reject){
            models.role.find({
                include:[
                    {model: models.user, as: 'user', where: {email: email},attributes: ['id','email','password', 'isActivated', 'createdAt'],},
                    {model: models.permission, as: 'permission'}
                ]
            }).then(result => {
                var role = result.name;
                var user = result.user[0];
                if(!user) {
                    reject({status: 404})
                } else {
                    user.setDataValue('role' ,role);
                    var passwordIsValid = bcrypt.compareSync(password, user.password);
                    if (!passwordIsValid) {
                        reject({status: 404});
                    } else {
                        if(!user.isActivated) {
                            var now = moment();
                            var createdDate = moment(user.createdAt);
                            var isExpired = (createdDate.diff(now, "h") < 24) ? true : false;
                            user.setDataValue('isExpired', isExpired);
                        }
                        var token = jwt.sign({ id: user.id }, config.secret);
                        user.token = token;
                        resolve(user);
                    }
                }
            }).error(err => {
                reject({status: httpStatus.INTERNAL_SERVER_ERROR, err: err});
            })
        });
    }

    var updateLastLogin = function(user) {
        return new Promise(function(resolve, reject){
            models.user.update({
                lastLogin: lastLogin
            }, {
                where: {
                    email: email
                }
            }).then(function(){
                resolve(user);
            }).error(function(err){
                reject({status: httpStatus.INTERNAL_SERVER_ERROR, err: err});
            })
        });
    }
    checkValue().then(function(){
        return checkUser();
    }).then(function(user){
        return updateLastLogin(user);
    }).then(function(user){
        res.send({ auth: true, user, status: httpStatus.OK });
    }).catch(function(err){
        res.send({status: httpStatus.INTERNAL_SERVER_ERROR, err: err});
    })
}

//Todo
exports.resetPassword = function(req, res) {

}

//Todo
exports.confirmUser = function(req, res) {
    
}