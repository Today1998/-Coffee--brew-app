const { Sequelize } = require('sequelize');

// Initialize the active database instance connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './dev.sqlite',
    logging: false
});

// 🌟 EXPORT THE INSTANCE CORRECTLY
module.exports = sequelize;
