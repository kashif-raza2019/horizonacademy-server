// Create mysql2 db connection secured
const mysql = require('mysql2');

const _db_config_  = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

console.log("Database configuration:", _db_config_);

const pool = mysql.createPool(_db_config_);

const db = pool.promise();

async function testDbConnection() {
    try {
        await db.query('SELECT 1');
        console.log('✅ Database connection successful');
        return true;
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        return false;
    }
}

module.exports = db;
module.exports.testDbConnection = testDbConnection;