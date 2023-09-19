const express = require('express');
const router = express.Router();
const db = require('../database/db')
const checkAuth = require('../middleware/checkAuth')
const Admin = require('../middleware/admin')

router.get('/', (req, res) => {

    const qry = "SELECT * FROM countries"
    const params = [];

    db.all(qry, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: "succes",
            data: rows,
        });
    });
});

router.get("/:id", (req, res) => {
    let qry = "select * from countries where countryID = ?";
    let params = [req.params.id];
    db.get(qry, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200);
        res.json({
            categorie: row
        });
    });
});


router.patch("/:id", checkAuth, Admin, (req, res) => {
    let qry = `UPDATE countries set naam = coalesce(?,naam) WHERE countryID = ?`;


    let params = [
        req.body.naam,
        req.params.id

    ];
    db.run(qry, params, function(err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200);
        res.json({
            changes: this.changes,
        });
    });

});


router.delete("/:id", checkAuth, Admin, (req, res) => {
    let qry = "DELETE FROM countries WHERE countryID = ?";
    let params = [req.params.id];

    db.run(qry, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(412);
            res.json({
                message: `Record ${req.params.id} niet gevonden.`,
            });
        } else {
            res.status(200);
            res.json({
                message: `Record ${req.params.id} deleted.`,
            });
        }
    });
});

router.post("/", checkAuth, Admin, (req, res) => {
    let errors = [];
    if (!req.body.naam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.naam.match(regex);
        if (!valideer) {
            errors.push("Geen land ingevuld");
        }
        console.log(errors.length);
        if (errors.length) {
            res.status(400).json({ errors });
            return;
        }

    }

    let qry = `INSERT INTO "countries"
	(naam)
	VALUES (?)`;

    let params = [
        req.body.naam,

    ];
    db.run(qry, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200);
        res.json({
            id: this.lastID,
        });
    });
});


module.exports = router;