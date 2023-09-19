const express = require('express');
const router = express.Router();
const db = require('../database/db')
const checkAuth = require('../middleware/checkAuth')
const Admin = require('../middleware/admin')

router.post("/", checkAuth, Admin, (req, res) => {
    let errors = [];
    if (!req.body.cnaam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.cnaam.match(regex);
        if (!valideer) {
            errors.push("Geen categorienaam ingevuld");
        }
        console.log(errors.length);
        if (errors.length) {
            res.status(400).json({ errors });
            return;
        }

    }

    let qry = `INSERT INTO "Categorie"
	(cnaam)
	VALUES (?)`;

    let params = [
        req.body.cnaam,

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

router.get('/', (req, res) => {

    const qry = "SELECT * FROM Categorie"
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
    let qry = "select * from Categorie where categorieID = ?";
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

router.get("/:id/product", (req, res) => {
    let qry = "select productID, pnaam, pcode, pbeschrijving, product.cID, phoeveelheid, prijs * 1.21 AS `prijsbtw` from product INNER JOIN categorie ON product.cID =categorieID where  categorieID = ?";
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
    let errors = [];
    if (req.body.cnaam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.cnaam.match(regex);
        if (!valideer) {
            errors.push("CategorieNaam moet alfabetisch zijn en tenminste 2 letters bevatten");
        }
    }

    if (errors.length) {
        res.status(400).json({ errors });

        return;
    }

    let qry = `UPDATE categorie set
    cnaam = coalesce(?,cnaam) 
    WHERE categorieID = ?`;

    let params = [
        req.body.cnaam,
        req.params.id,

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
    let qry = "DELETE FROM categorie WHERE categorieID = ?";
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





module.exports = router;