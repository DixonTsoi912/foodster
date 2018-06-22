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
  });

  role.associate = function(models) {
    role.hasMany(models.user, {
        foreignKey: 'roleId',
        as: 'user'
    });

    role.hasMany(models.permission, {
        foreignKey: 'roleId',
        as: 'permission'
    });
  };

  return role;
};