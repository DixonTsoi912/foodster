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
    roleId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    }
  },{
  });

  permission.assoicate = function(models) {
      permission.belongsTo(models.role, {
          foreignKey: 'roleId',
          as: 'role'
      })
  };

  return permission;
};