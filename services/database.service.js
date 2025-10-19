// Create mysql2 db connection secured
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

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