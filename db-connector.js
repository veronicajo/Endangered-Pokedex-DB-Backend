// Get an instance of mysql we can use in the app
var mysql = require('mysql')
require('dotenv').config();
console.log(process.env);
// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : process.env.USERNAME,
    password        : process.env.PW,
    database        : process.env.DB
})

// Export it for use in our application
module.exports.pool = pool;