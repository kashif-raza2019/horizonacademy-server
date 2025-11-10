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

// console.log("Database configuration:", _db_config_);

// Enable multipleStatements only in non-production environments so test SQL files
// containing multiple statements can be executed by the /test-db endpoint.
// We avoid enabling it in production to reduce risk of accidental multi-statement SQL execution elsewhere.
if (process.env.NODE_ENV !== 'production') {
    _db_config_.multipleStatements = true;
}

const pool = mysql.createPool(_db_config_);

const db = pool.promise();

async function testDbConnection() {
    // if(process.env.NODE_ENV !== 'production') {
    //     console.log("Skipping database connection test in non-production environment");
    //     return true;
    // }
    try {
        await db.query('SELECT 1');
        console.log('✅ Database connection successful');
        return true;
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        // Retry the connection after 5 seconds
        setTimeout(testDbConnection, 5000);
        return false;
    }
}

module.exports = db;
module.exports.testDbConnection = testDbConnection;