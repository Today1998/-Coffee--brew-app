const { Sequelize } = require('sequelize');
require('dotenv').config();

// Connect to a hosted PostgreSQL/MySQL DB if available, otherwise fallback to local SQLite
const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    })
    : new Sequelize({
        dialect: 'sqlite',
        storage: './dev.sqlite',
        logging: false
    });

module.exports = sequelize;
