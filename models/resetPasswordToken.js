'use strict';

module.exports = (sequelize, DataTypes) => {
  var resetPasswordToken = sequelize.define('resetPasswordToken', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    }
  },{
  });

  resetPasswordToken.assoicate = function(models) {
    resetPasswordToken.hasMany(models.user, {
        foreignKey: 'userId',
        as: 'user'
    })
  };

  return resetPasswordToken;
};