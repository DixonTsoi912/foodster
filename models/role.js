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
            role.belongsTo(models.user);
            post.hasMany(models.permission);
        }
  }});


  return role;
};