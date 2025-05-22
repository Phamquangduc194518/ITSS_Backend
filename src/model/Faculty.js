const {Model, DataTypes} = require('sequelize')
const sequelize = require('../config/database');

class Faculty extends Model{}

Faculty.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    name: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    introduce: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    imageUrl:{
      type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
    },
    {
      sequelize,
      modelName: 'Faculty',
      tableName: 'faculties',
      timestamps: false,
    })

module.exports = Faculty;