const bcrypt = require('bcrypt');
const models = require('../models');
const Promise = require('promise');
const httpStatus = require('http-status-codes');

exports.getUserProfile = function(req , res) {
    let userId = req.userId;
    if(userId) {
        models.user.find({
            where: {
                id: userId
            },
            attributes:['id', 'email', 'name', 'profileURL', 'lastLogin']
        }).then(user => {
            res.status(httpStatus.OK).send({user: user});
        }).error(err => {
            res.send({status: httpStatus.INTERNAL_SERVER_ERROR, err: err});
        })
    } else {
        res.send({status: 400, err: 'empty user id'});
    }
}

exports.updateUserProfile = function(req, res) {
    let userId = req.body.userId;
    let profileURL = req.body.profileURL;
    let name = req.body.name;
    
    var checkValue = function() {
        return new Promise(function(resolve, reject){
            if(userId) {
                models.user.find({
                    where: {
                        id: userId
                    },
                    attributes: ['id']
                }).then(user => {
                    if(user) {
                        resolve(httpStatus.OK);
                    } else {
                        reject({status: 400, err: 'empty user id'});
                    }
                }).error(err => {
                    reject({status: 400, err: err});
                })
            } else {
                reject({status: 400, err: 'empty user id'});
            }
        });
    };

    var updateProfile = function(status) {
        return new Promise(function(resolve, reject){
            if(status == httpStatus.OK) {
                models.user.update({
                    profileURL: profileURL,
                    name: name    
                }, {
                    where: {
                        id: userId
                    }
                }).then(user => {
                    resolve({status: httpStatus.OK});
                }).error(err => {
                    resolve({status: httpStatus.INTERNAL_SERVER_ERROR, err: err});
                })
            } else {
                reject({status: status });
            }
        });
    }
    
    checkValue().then(function(status){
        return updateProfile(status);
    }).then(function(status){
        res.send(status);
    }).catch(function(err){
        res.send({status: httpStatus.INTERNAL_SERVER_ERROR, err: err});
    })
}