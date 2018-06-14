const bcrypt = require('bcrypt');
const models = require('../models');
const Promise = require('promise');

exports.getUserProfile = function(req , cb) {
    let userId = req.params.id;
    if(userId) {
        models.user.find({
            where: {
                id: userId
            },
            attributes:['id', 'email', 'name', 'profileURL', 'lastLogin']
        }).then(user => {
            cb({status: 200, user: user});
        }).error(err => {
            cb({status: 500, err: err});
        })
    } else {
        cb({status: 400, err: 'empty user id'});
    }
}

exports.updateUserProfile = function(req, cb) {
    let userId = req.body.userId;
    let profileURL = req.body.profileUrl;
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
                        resolve({status: 200});
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
            if(status == 200) {
                models.user.update({
                    where: {
                        id: userId
                    }
                }, {
                    profileURL: profileURL,
                    name: name
                }).then(user => {
                    resolve({status: 200});
                }).error(err => {
                    resolve({status: 500, err: err});
                })
            } else {
                reject({status: status });
            }
        });
    }
    
    checkValue().then(function(status){
        return updateProfile(status);
    }).then(function(status){
        cb(status);
    }).catch(function(err){
        cb({status: 500, err: err});
    })
}