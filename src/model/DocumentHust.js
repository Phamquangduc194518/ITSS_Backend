const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Course = require('./Course');
const User = require('./User');
class DocumentHust extends Model {}

DocumentHust.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Course,
            key: "id"
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
    year_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'DocumentHust',
    tableName: 'document_hust',
    timestamps: true,
  }
);
module.exports = DocumentHust