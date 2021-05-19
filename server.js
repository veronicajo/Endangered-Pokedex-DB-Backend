/*
    SETUP
*/
// Express
var express = require('express');
var app     = express();            
PORT        = 60500;               
// Database
var db = require('./db-connector')

/*
    ROUTES
*/
app.get('/', (req, res) => {});

/*
    LISTENER
*/
app.listen(PORT, function(){         
console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});