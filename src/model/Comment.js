const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const DocumentHust = require('./DocumentHust');

class Comment extends Model { }

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 5,
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        document_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: DocumentHust,
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        like_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        dislike_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

    },
    {
        sequelize,
        modelName: 'Comment',
        tableName: 'comments',
        timestamps: true,
    }
);

module.exports = Comment;
