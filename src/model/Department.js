const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Faculty = require('./Faculty');

class Department extends Model {}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    faculty_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references : {
        model: Faculty,
        key: 'id'
      },
    onDelete: 'CASCADE',  
    onUpdate: 'CASCADE'
    },
  },
  {
    sequelize,
    modelName: 'Department',
    tableName: 'departments',
    timestamps: false,
  }
);

module.exports = Department