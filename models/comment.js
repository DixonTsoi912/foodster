'use strict';

module.exports = (sequelize, DataTypes) => {
  var comment = sequelize.define('comment', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    content: DataTypes.TEXT,
    likeCount: DataTypes.INTEGER,
    dislikeCount: DataTypes.INTEGER,
    postId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    }
  }, {
  });
  
  comment.associate = function(models) {
    comment.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'comment'
    })
  };

  comment.associate = function(models) {
    comment.belongsTo(models.post, {
        foreignKey: 'userId',
        as: 'post'
    })
  };

  return comment;
};