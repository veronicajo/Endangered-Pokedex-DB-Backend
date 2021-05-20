const express = require('express');
const app = express(); 
require('dotenv').config();           
PORT = process.env.PORT || 60500;               
const db = require('./db-connector')
const cors = require('cors');
const bodyParser = require('body-parser');
/*
    ROUTES
*/
// Middleware 
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/get/numberLeft', (req, res) => {
    const tableName = req.params.table;
        const sqlSelect = `SELECT numberLeftId, CASE WHEN inCaptivity = -1 THEN 'UNKNOWN' ELSE inCaptivity END as inCaptivity, inWild, decade, conservationStatus, (SELECT es.commonName) as animal, es.animalId FROM numberLeft nl INNER JOIN endangeredSpecies es ON es.animalId = nl.animalId`;
        db.pool.query(sqlSelect, (err, result) => {
            console.log("QUERY ERROR ", err);
            console.log(result);
            res.send(JSON.stringify(result));
        });
});

app.get('/get/:table', (req, res) => {
    const tableName = req.params.table;
    if (tableName) {
        const sqlSelect = `SELECT * FROM ${tableName}`;
        db.pool.query(sqlSelect, (err, result) => {
            console.log("QUERY ERROR ", err);
            console.log(result);
            res.send(JSON.stringify(result));
        });
    } else {
        res.send("Incorrect table requested");
    }
});

app.get('/get/endangeredHabitats/nativeHabitats/habitatId', (req, res) => {
        const sqlSelect = `SELECT es.commonName as animal, es.animalId, h.habitatId, h.nativeHabitatCoordinates as location FROM
        (
            endangeredHabitats
            INNER JOIN endangeredSpecies es ON endangeredHabitats.animalId = es.animalId
            INNER JOIN nativeHabitats h ON endangeredHabitats.habitatId = h.habitatId
        );`;
        db.pool.query(sqlSelect, (err, result) => {
            console.log("QUERY ERROR ", err);
            console.log(result);
            res.send(JSON.stringify(result));
        });
})

app.get('/get/endangeredNonprofits/nonprofits/nonprofitId', (req, res) => {
        const sqlSelect = `SELECT es.commonName as animal, np.nonprofitName as nonprofit, es.animalId, np.nonprofitId FROM
        (
            endangeredNonprofits
            INNER JOIN endangeredSpecies es ON endangeredNonprofits.animalId = es.animalId
            INNER JOIN nonprofits np ON endangeredNonprofits.nonprofitId = np.nonprofitId
        );`;
        db.pool.query(sqlSelect, (err, result) => {
            console.log("QUERY ERROR ", err);
            console.log(result);
            res.send(JSON.stringify(result));
        });
})

/*
    LISTENER
*/
app.listen(PORT, function(){         
console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});