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
app.use(bodyParser.json());
app.use(errorHandler);

/**
 * SELECT/GET
 */
app.get('/select/numberLeft', (req, res) => {
    const tableName = req.params.table;
        const sqlSelect = `SELECT numberLeftId, CASE WHEN inCaptivity = -1 THEN 'UNKNOWN' ELSE inCaptivity END as inCaptivity, inWild, decade, conservationStatus, (SELECT es.commonName) as animal, es.animalId FROM numberLeft nl INNER JOIN endangeredSpecies es ON es.animalId = nl.animalId`;
        db.pool.query(sqlSelect, (err, result) => {
            if (err) console.log("SELECT NL QUERY ERROR ", err);
            res.send(JSON.stringify(result));
        });
});

app.get('/select/:table', (req, res) => {
    const tableName = req.params.table;
    if (tableName) {
        const sqlSelect = `SELECT * FROM ${tableName}`;
        db.pool.query(sqlSelect, (err, result) => {
            if (err) console.log("SELECT TABLE QUERY ERROR ", err);
            res.send(JSON.stringify(result));
        });
    } else {
        res.send("Incorrect table requested");
    }
});

app.get('/select/endangeredHabitats/nativeHabitats/habitatId', (req, res) => {
        const sqlSelect = `SELECT es.commonName as animal, es.animalId, h.habitatId, h.nativeHabitatCoordinates as location FROM
        (
            endangeredHabitats
            INNER JOIN endangeredSpecies es ON endangeredHabitats.animalId = es.animalId
            INNER JOIN nativeHabitats h ON endangeredHabitats.habitatId = h.habitatId
        );`;
        db.pool.query(sqlSelect, (err, result) => {
            if (err) console.log("SELECT EH QUERY ERROR ", err);
            res.send(JSON.stringify(result));
        });
})

app.get('/select/endangeredNonprofits/nonprofits/nonprofitId', (req, res) => {
        const sqlSelect = `SELECT es.commonName as animal, np.nonprofitName as nonprofit, es.animalId, np.nonprofitId FROM
        (
            endangeredNonprofits
            INNER JOIN endangeredSpecies es ON endangeredNonprofits.animalId = es.animalId
            INNER JOIN nonprofits np ON endangeredNonprofits.nonprofitId = np.nonprofitId
        );`;
        db.pool.query(sqlSelect, (err, result) => {
            if (err) console.log("SELECT EN QUERY ERROR ", err);
            res.send(JSON.stringify(result));
        });
})

/**
 * INSERT/POST
 */
app.post('/insert/endangeredSpecies', (req, res, next) => {
    const dt = req.body;
    const sqlSelect = "INSERT INTO endangeredSpecies (scientificName, commonName, genus, family, `order`, class, phylum, cause, photoUrl, lastUpdate, captivityPlaceId) VALUES "+`('${dt.scientificName}', '${dt.commonName}', '${dt.genus}', '${dt.family}', '${dt.order}', '${dt.class}', '${dt.phylum}', '${dt.cause}', '${dt.photoUrl}', NOW(), ${dt.captivityPlaceId})`;
    db.pool.query(sqlSelect, (err, result) => {
        if (err) {
            next(new Error("INSERT FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

function errorHandler (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }
    res.status(500)
    res.send('error', { error: err })
  }
/*
    LISTENER
*/
app.listen(PORT, function(){         
console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});