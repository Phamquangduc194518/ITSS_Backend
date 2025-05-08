const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Department = require('./Department');

class Course extends Model {}

Course.init(
  {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    code: { 
        type: DataTypes.STRING, 
        allowNull: true, 
        unique: true 
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Department, key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: false,
  }
);

module.exports = Course