const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // This targets the newly moved db.js perfectly

const Brew = sequelize.define('Brew', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    beans: { type: DataTypes.STRING, allowNull: false },
    method: { type: DataTypes.STRING, allowNull: false },
    coffeeGrams: { type: DataTypes.FLOAT, allowNull: false },
    waterGrams: { type: DataTypes.FLOAT, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    tastingNotes: { type: DataTypes.TEXT, allowNull: true }
});
module.exports = Brew;
