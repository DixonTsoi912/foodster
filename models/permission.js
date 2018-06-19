'use strict';

module.exports = (sequelize, DataTypes) => {
  var permission = sequelize.define('permission', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    read: {
        type: DataTypes.BOOLEAN
    },
    write: {
        type: DataTypes.BOOLEAN
    },
    create: {
        type: DataTypes.BOOLEAN
    },
    delete: {
        type: DataTypes.BOOLEAN
    },
    deny: {
        type: DataTypes.BOOLEAN
    }
  },{
    classMethods: {
        associate: function(models) {
            permission.belongsTo(models.role);
        }
  }});


  return permission;
};