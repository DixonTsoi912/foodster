'use strict';

module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    email: DataTypes.STRING,
    password: DataTypes.TEXT,
    name: DataTypes.STRING,
    profileURL: DataTypes.TEXT,
    lastLogin: DataTypes.DATE
  }, {
    classMethods: {  
        associate: function(models) {
            user.hasMany(models.post,{foreignKey: 'userId'});
            user.hasMany(models.comment,{foreignKey: 'userId'});
        }
  }});
  

  return user;
};