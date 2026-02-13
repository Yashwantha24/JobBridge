const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('Testing connection to:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);
console.log('Port:', 5432);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');
        console.log('✅ Database is running and accessible.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Unable to connect to the database:');
        console.error(error.message);
        if (error.original && error.original.code === 'ECONNREFUSED') {
            console.error('   -> This means PostgreSQL is NOT running or NOT listening on port 5432.');
        } else if (error.original && error.original.code === '3D000') {
            console.error('   -> The database "job_portal" does not exist. Run "npm run setup-db".');
        }
        process.exit(1);
    }
}

testConnection();
