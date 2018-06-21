'use strict';

module.exports = (sequelize, DataTypes) => {
  var role = sequelize.define('role', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    }
  },{
    classMethods: {
        associate: function(models) {
            role.hasMany(models.user);
            role.hasMany(models.permission);
        }
  }});


  return role;
};