const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Comment = require('./Comment');

class CommentReaction extends Model {}

CommentReaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Comment,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM('like', 'dislike'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CommentReaction',
    tableName: 'comment_reactions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'comment_id'],
      },
    ],
  }
);

module.exports = CommentReaction;
