const express = require('express');
const app = express();            
PORT = 60500;               
const db = require('./db-connector')
const cors = require('cors');
const bodyParser = require('body-parser');
/*
    ROUTES
*/
// Middleware 
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/get/:table', (req, res) => {
    const tableName = req.params.table;
    if (tableName) {
        const sqlSelect = `SELECT * FROM ${tableName}`;
        db.pool.query(sqlSelect, (err, result) => {
            console.log(err);
            console.log(result);
            res.send(JSON.stringify(result));
        });
    } else {
        res.send("Incorrect table requested");
    }
});

/*
    LISTENER
*/
app.listen(process.env.PORT || PORT, function(){         
console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});