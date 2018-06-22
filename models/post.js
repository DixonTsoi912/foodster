'use strict';

module.exports = (sequelize, DataTypes) => {
  var post = sequelize.define('post', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    description: DataTypes.TEXT,
    likeCount: DataTypes.INTEGER,
    dislikeCount: DataTypes.INTEGER,
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    }
  },{
  });

  post.assoicate = function(models) {
    post.hasMany(models.user, {
        foreignKey: 'postId',
        as: 'user'
    })
  };

  post.assoicate = function(models) {
    post.hasMany(models.comment, {
        foreignKey: 'commentId',
        as: 'user'
    })
  };

  return post;
};