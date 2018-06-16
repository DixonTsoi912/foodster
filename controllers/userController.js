const bcrypt = require('bcrypt');
const models = require('../models');
const Promise = require('promise');

exports.getUserProfile = function(req , res) {
    let userId = req.userId;
    if(userId) {
        models.user.find({
            where: {
                id: userId
            },
            attributes:['id', 'email', 'name', 'profileURL', 'lastLogin']
        }).then(user => {
            res.send({status: 200, user: user});
        }).error(err => {
            res.send({status: 500, err: err});
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
                        resolve(200);
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
                    profileURL: profileURL,
                    name: name    
                }, {
                    where: {
                        id: userId
                    }
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
        res.send(status);
    }).catch(function(err){
        res.send({status: 500, err: err});
    })
}