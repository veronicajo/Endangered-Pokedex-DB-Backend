// Get an instance of mysql we can use in the app
var mysql = require('mysql')
require('dotenv').config();

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 1000,
    connectTimeout: 60 * 60 * 1000,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : process.env.USERNAME,
    password        : process.env.PW,
    database        : process.env.DB
})

// Export it for use in our application
module.exports.pool = pool;