const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config  = require('../configs/config.json');
const moment = require('moment');
const Promise = require('promise');
const validator = require("email-validator");

exports.signup = function(req, cb) {
    var email = req.body.email.trim();
    var password = req.body.password.trim();
    var lastLogin = moment().format('YYYY-MM-DD  h:mm:ss');
    var checkUser = function() {
        return new Promise(function(resolve, reject) {
            if(validator.validate(email) && password) {
                models.user.findAll({
                    email: email,
                    attributes: ['id']
                }).then(user => {
                    if(user.length > 0) {
                        reject({status: 409})
                    } else {
                        resolve();
                    }
                }).error(err => {
                    reject({status: 500, err: err});
                })
            } else {
                reject({status: 500});
            }
        })
    }
    var createUser = function() {
        return new Promise(function(resolve, reject) {
            if(email && password) {
                var hashedPassword = bcrypt.hashSync(password, 8);
                models.user.create({
                    email: email,
                    password: hashedPassword,
                    lastLogin: lastLogin
                }).then(user => {
                    // create a token
                    var token = jwt.sign({ id: user.id }, config.secret);
                    cb({ auth: true, token: token, status: 200 });
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
        cb(result);
    }).catch(function(err){
        cb(err);
    })
}

exports.login = function(req, cb) {
    var email = req.body.email.trim();
    var password = req.body.password.trim();
    var lastLogin = moment().format('YYYY-MM-DD  h:mm:ss');

    var checkValue = function() {
        return new Promise(function(resolve, reject){
            if(email && password) {
                resolve();
            } else {
                reject({status: 500})
            }
        });
    }

    var checkUser = function() {
        return new Promise(function(resolve, reject){
            models.user.find({
                where: {
                    email: email
                },
                attributes: ['id','email','password']
            }).then(function(user){
                if(!user) {
                    reject({status: 404})
                } else {
                    var passwordIsValid = bcrypt.compareSync(password, user.password);
                    if (!passwordIsValid) {
                        reject({status: 404});
                    } else {
                        var token = jwt.sign({ id: user.id }, config.secret);
                        resolve(token);
                    }
                }
            }).error(function(err){
                reject({status: 500, err: err});
            })
        });
    }

    var updateLastLogin = function(token) {
        return new Promise(function(resolve, reject){
            models.user.update({
                lastLogin: lastLogin
            }, {
                where: {
                    email: email
                }
            }).then(function(){
                resolve(token);
            }).error(function(err){
                reject({status: 500, err: err});
            })
        });
    }
    checkValue().then(function(){
        return checkUser();
    }).then(function(token){
        return updateLastLogin(token);
    }).then(function(token){
        cb({ auth: true, token: token, status: 200 });
    }).catch(function(err){
        cb({status: 500, err: err});
    })
}