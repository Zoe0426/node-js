const mysql = require("mysql2");

const {DB_HOST,DB_USER,DB_PWD,DB_NAME} = process.env;
console.log({DB_HOST,DB_USER,DB_PWD,DB_NAME});

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PWD,
    database: DB_NAME,

    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0,
});

module.exports = pool.promise();