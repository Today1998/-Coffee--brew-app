const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Brew = sequelize.define('Brew', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    beans: {
        type: DataTypes.STRING,
        allowNull: false // Enforces validation requirements
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coffeeGrams: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    waterGrams: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 5
        }
    },
    tastingNotes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Brew;
