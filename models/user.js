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
    lastLogin: DataTypes.DATE,
    isActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    roleId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    }
  }, {
  });
  
  user.assoicate = function(models) {
    user.belongsTo(models.role, {
        foreignKey: 'roleId',
        as: 'role'
    })
   };

  user.associate = function(models) {
    user.hasMany(models.post, {
        foreignKey: 'userId',
        as: 'user'
    })
  };

  user.associate = function(models) {
    user.hasMany(models.comment, {
        foreignKey: 'userId',
        as: 'user'
    })
  };

  return user;
};