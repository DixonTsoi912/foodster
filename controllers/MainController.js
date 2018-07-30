const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config  = require('../configs/config.json');
const moment = require('moment');
const Promise = require('promise');
const validator = require("email-validator");
const child = require('child_process');
const httpStatus = require('http-status-codes');
const logger = require('../helper/logger');
const mailer = require('../helper/emailer');

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
                var userData = result.user[0];
                var user = {};
                if(!userData) {
                    reject({status: 404})
                } else {
                    user['role'] = role;
                    var passwordIsValid = bcrypt.compareSync(password, userData.password);
                    if (!passwordIsValid) {
                        reject({status: 404});
                    } else {
                        if(!user.isActivated) {
                            var now = moment();
                            var createdDate = moment(userData.createdAt);
                            var isExpired = (createdDate.diff(now, "h") < 24) ? true : false;
                            user['isExpired'] = isExpired;
                        }
                        var token = jwt.sign({ id: userData.id }, config.secret);
                        user['token'] = token;
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

//Send email
exports.createResetPasswordToken = function(req, res) {
    var userId = req.userId;
    
    var createPasswordToken = function() {
        return new Promise(function(resolve, reject){
            if(userId) {
                models.resetPasswordToken.create({
                    userId: userId
                }).then((token) => {
                    if(token) {
                        resolve({token: token, status: httpStatus.OK})
                    } else {
                        reject({status: httpStatus.INTERNAL_SERVER_ERROR});
                    }
                }).catch(err => {
                    reject({status: httpStatus.INTERNAL_SERVER_ERROR, err: err});
                });
            } else {
                reject({status: httpStatus.INTERNAL_SERVER_ERROR});
            }
        })
    }

    var sendEmail = function(result) {
        return new Promise(function(resolve, reject) {
            var token = result.token;
            if(userId) {
                models.user.find({
                    where: {
                        id: userId
                    },
                    attributes: ['id', 'email', 'name']
                }).then((user) => {
                    //Send Email
                    var emailRecipients = [];
                    emailRecipients.push('dixon.tsoi@nevesoft.com');
                    var obj = {
                        subject: 'Reset Password',
                        recipients: emailRecipients,
                        substitution : {
                            __link__ : 'http://localhost:3000/resetPassword/' + token.id
                        }
                    }
                    mailer.sendEmail(obj, 'resetPassword.txt');
                    logger.info("Email Sent, Reset Password");
                    resolve();
                }).catch((err) => {
                    reject({status: httpStatus.INTERNAL_SERVER_ERROR, err: err});
                })
            } else {
                reject({status: httpStatus.INTERNAL_SERVER_ERROR, err: 'no user id find'});
            }
        })
    }

    createPasswordToken().then(function(result){
        return sendEmail(result)
    }).then(function(result){
        res.send({status: httpStatus.OK , result: result});
    }).catch((err) => {
        res.send({status: httpStatus.INTERNAL_SERVER_ERROR, err: err});
    })

}

exports.confirmUser = function(req, res) {
    var userId = req.user.id;
    if(userId) {
        model.user.updateAttributes({
            isActivated: true
        }, {
            where: {
                id: userId
            }
        }).then(() => {
            res.send({token: token,status: httpStatus.OK})
        }).catch(err => {
            res.send({status: httpStatus.INTERNAL_SERVER_ERROR, err: err});
        });
    }
}