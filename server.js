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
        const sqlSelect = `SELECT endangeredHabitatId, es.commonName as animal, es.animalId, h.habitatId, h.nativeHabitatCoordinates as location FROM
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
        const sqlSelect = `SELECT endangeredNonprofitId, es.commonName as animal, np.nonprofitName as nonprofit, es.animalId, np.nonprofitId FROM
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
    const sqlInsert = "INSERT INTO endangeredSpecies (scientificName, commonName, genus, family, kingdomOrder, class, phylum, cause, photoUrl, lastUpdate, captivityPlaceId) VALUES "+`('${dt.scientificName}', '${dt.commonName}', '${dt.genus}', '${dt.family}', '${dt.kingdomOrder}', '${dt.class}', '${dt.phylum}', '${dt.cause}', '${dt.photoUrl}', NOW(), ${dt.captivityPlaceId})`;
    db.pool.query(sqlInsert, (err, result) => {
        if (err) {
            next(new Error("INSERT FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.post('/insert/nonprofits', (req, res, next) => {
    const dt = req.body;
    const sqlInsert = "INSERT INTO nonprofits (nonprofitName, nonprofitWebsite) VALUES "+`('${dt.nonprofitName}', '${dt.nonprofitWebsite}')`;
    db.pool.query(sqlInsert, (err, result) => {
        if (err) {
            next(new Error("INSERT FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.post('/insert/endangeredNonprofits', (req, res, next) => {
    const dt = req.body;
    const sqlInsert = "INSERT INTO endangeredNonprofits (animalId, nonprofitId) VALUES "+`('${dt.animalId}', '${dt.nonprofitId}')`;
    db.pool.query(sqlInsert, (err, result) => {
        if (err) {
            next(new Error("INSERT FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.post('/insert/nativeHabitats', (req, res, next) => {
    const dt = req.body;
    const sqlInsert = "INSERT INTO nativeHabitats (continent, country, biome, nativeHabitatCoordinates) VALUES "+`('${dt.continent}', '${dt.country}', '${dt.biome}', '${dt.nativeHabitatCoordinates}')`;
    db.pool.query(sqlInsert, (err, result) => {
        if (err) {
            next(new Error("INSERT FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.post('/insert/endangeredHabitats', (req, res, next) => {
    const dt = req.body;
    const sqlInsert = "INSERT INTO endangeredHabitats (animalId, habitatId) VALUES "+`('${dt.animalId}', '${dt.habitatId}')`;
    db.pool.query(sqlInsert, (err, result) => {
        if (err) {
            next(new Error("INSERT FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.post('/insert/captivityPlaces', (req, res, next) => {
    const dt = req.body;
    const sqlInsert = "INSERT INTO captivityPlaces (zooName, zooCity, zooState, zooCountry, zooCoordinates) VALUES "+`('${dt.zooName}', '${dt.zooCity}', '${dt.zooState}', '${dt.zooCountry}', '${dt.zooCoordinates}')`;
    db.pool.query(sqlInsert, (err, result) => {
        if (err) {
            next(new Error("INSERT FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.post('/insert/numberLeft', (req, res, next) => {
    const dt = req.body;
    const sqlInsert = "INSERT INTO numberLeft (animalId, inCaptivity, inWild, decade, conservationStatus) VALUES "+`('${dt.animalId}', '${dt.inCaptivity}', '${dt.inWild}', '${dt.decade}', '${dt.conservationStatus}')`;
    db.pool.query(sqlInsert, (err, result) => {
        if (err) {
            next(new Error("INSERT FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

/**
 * UPDATE/PUT
 */
// NEED TO ALLOW FOR NULL IN CAPTIVITYPLACEID and fix NOW()
app.put('/update/endangeredSpecies', (req, res, next) => {
    const dt = req.body;
    const values = [dt.scientificName, dt.commonName, dt.genus, dt.family, dt.kingdomOrder, dt.class, dt.phylum, dt.cause, dt.photoUrl, dt.captivityPlaceId, dt.animalId];
    const sqlUpdate = "UPDATE endangeredSpecies SET scientificName=?, commonName=?, genus=?, family=?, kingdomOrder=?, class=?, phylum=?, cause=?, photoUrl=?, lastUpdate=NOW(), captivityPlaceId=? WHERE animalId=?";
    db.pool.query(sqlUpdate, values,
        (err, result) => {
        if (err) {
            next(new Error("UPDATE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.put('/update/nonprofits', (req, res, next) => {
    const dt = req.body;
    const values = [dt.nonprofitName, dt.nonprofitWebsite, dt.nonprofitId];
    const sqlUpdate = "UPDATE nonprofits SET nonprofitName=?, nonprofitWebsite=? WHERE nonprofitId=?";
    db.pool.query(sqlUpdate, values,
        (err, result) => {
        if (err) {
            next(new Error("UPDATE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.put('/update/endangeredNonprofits', (req, res, next) => {
    const dt = req.body;
    const values = [dt.animalId, dt.nonprofitId, dt.endangeredNonprofitId];
    const sqlUpdate = "UPDATE endangeredNonprofits SET animalId=?, nonprofitId=? WHERE endangeredNonprofitId=?";
    db.pool.query(sqlUpdate, values,
        (err, result) => {
        if (err) {
            next(new Error("UPDATE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.put('/update/nativeHabitats', (req, res, next) => {
    const dt = req.body;
    const values = [dt.continent, dt.country, dt.biome, dt.nativeHabitatCoordinates, dt.habitatId];
    const sqlUpdate = "UPDATE nativeHabitats SET continent=?, country=?, biome=?, nativeHabitatCoordinates=? WHERE habitatId=?";
    db.pool.query(sqlUpdate, values,
        (err, result) => {
        if (err) {
            next(new Error("UPDATE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.put('/update/endangeredHabitats', (req, res, next) => {
    const dt = req.body;
    const values = [dt.animalId, dt.habitatId, dt.endangeredHabitatId];
    const sqlUpdate = "UPDATE endangeredHabitats SET animalId=?, habitatId=? WHERE endangeredHabitatId=?";
    db.pool.query(sqlUpdate, values,
        (err, result) => {
        if (err) {
            next(new Error("UPDATE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.put('/update/captivityPlaces', (req, res, next) => {
    const dt = req.body;
    const values = [dt.zooName, dt.zooCity, dt.zooState, dt.zooCountry, dt.zooCoordinates, dt.zooId];
    const sqlUpdate = "UPDATE captivityPlaces SET zooName=?, zooCity=?, zooState=?, zooCountry=?, zooCoordinates=? WHERE zooId=?";
    db.pool.query(sqlUpdate, values,
        (err, result) => {
        if (err) {
            next(new Error("UPDATE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.put('/update/numberLeft', (req, res, next) => {
    const dt = req.body;
    const values = [parseInt(dt.animalId), dt.inCaptivity, dt.inWild, dt.decade, dt.conservationStatus, dt.numberLeftId];
    const sqlUpdate = "UPDATE numberLeft SET animalId=?, inCaptivity=?, inWild=?, decade=?, conservationStatus=? WHERE numberLeftId=?";
    db.pool.query(sqlUpdate, values,
        (err, result) => {
        if (err) {
            next(new Error("UPDATE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

/**
 * DELETE
 */
app.delete('/delete/endangeredSpecies',(req, res, next) => {
    const sqlDelete = "DELETE FROM endangeredSpecies WHERE animalId=?";
    db.pool.query(sqlDelete, [req.body.animalId],
        (err, result) => {
        if (err) {
            next(new Error("DELETE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.delete('/delete/nonprofits',(req, res, next) => {
    const sqlDelete = "DELETE FROM nonprofits WHERE nonprofitId=?";
    db.pool.query(sqlDelete, [req.body.nonprofitId],
        (err, result) => {
        if (err) {
            next(new Error("DELETE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.delete('/delete/endangeredNonprofits',(req, res, next) => {
    const sqlDelete = "DELETE FROM endangeredNonprofits WHERE endangeredNonprofitId=?";
    db.pool.query(sqlDelete, [req.body.endangeredNonprofitId],
        (err, result) => {
        if (err) {
            next(new Error("DELETE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.delete('/delete/nativeHabitats',(req, res, next) => {
    const sqlDelete = "DELETE FROM nativeHabitats WHERE habitatId=?";
    db.pool.query(sqlDelete, [req.body.habitatId],
        (err, result) => {
        if (err) {
            next(new Error("DELETE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.delete('/delete/endangeredHabitats',(req, res, next) => {
    const sqlDelete = "DELETE FROM endangeredHabitats WHERE endangeredHabitatId=?";
    db.pool.query(sqlDelete, [req.body.endangeredHabitatId],
        (err, result) => {
        if (err) {
            next(new Error("DELETE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.delete('/delete/captivityPlaces',(req, res, next) => {
    const sqlDelete = "DELETE FROM captivityPlaces WHERE zooId=?";
    db.pool.query(sqlDelete, [req.body.zooId],
        (err, result) => {
        if (err) {
            next(new Error("DELETE FAILED"));
        } else {
            console.log(result);
            res.send("done");
        }
    });
})

app.delete('/delete/numberLeft',(req, res, next) => {
    const sqlDelete = "DELETE FROM numberLeft WHERE numberLeftId=?";
    db.pool.query(sqlDelete, [req.body.numberLeftId],
        (err, result) => {
        if (err) {
            next(new Error("DELETE FAILED"));
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