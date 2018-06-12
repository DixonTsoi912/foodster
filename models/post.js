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
    classMethods: {
        associate: function(models) {
            post.hasMany(models.user, {foreignKey: 'userId'});
            post.hasMany(models.comment, {foreignKey: 'userId'});
        }
  }});


  return post;
};