const express = require('express');
const router = express.Router();
const db = require('../database/db')
const checkAuth = require("../middleware/checkAuth");
const Admin = require('../middleware/admin')

// SELECT  productID, pnaam, pcode, pbeschrijving, prijs, product.cID, phoeveelheid, prijs * 1.21 AS 'prijsbtw' itle ||''|| description as search from product where ${params.map((zoekwoord)=> `search LIKE ?`).join(' AND ')}`

router.get('/', (req, res) => {
            let qry;
            let params = [];
            if (req.query.q) {
                params = req.query.q.split(" ").map((zoekwoord) => `%${zoekwoord}%`);
                qry = `select productID, pnaam, pcode, pbeschrijving, phoeveelheid, product.cID, prijs * 1.21 AS 'prijsbtw', pnaam ||''|| pbeschrijving as search from product 
        WHERE ${params.map((zoekwoord)=> `search LIKE ?`).join(" AND ")}`;
        console.log(req.query.q);
        // const params = [req.params.id];

    } else {
        qry = `select productID, pnaam, pcode, pbeschrijving, phoeveelheid, product.cID, prijs * 1.21 AS 'prijsbtw' from product`;
        console.log(req.query.q);
    }
    // const params = [req.params.id];
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
    let qry = "select * from product where productID = ?";
    let params = [req.params.id];
    db.get(qry, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200);
        res.json({
            productID: row
        });
    });
});
router.post("/", checkAuth, Admin,(req, res) => {
    let errors = [];
    if (!req.body.pnaam) {
        errors.push("Geen product ingevuld");
        console.log(errors.length);
        if (errors.length) {
            res.status(400).json({ errors });
            return;
        }

    }

    let qry = `INSERT INTO "product"
	(pnaam, pcode, pbeschrijving, phoeveelheid, prijs, cID)
	VALUES (?,?,?,?,?,?)`;

    let params = [
        req.body.pnaam,
        req.body.pcode,
        req.body.pbeschrijving,
        req.body.phoeveelheid,
        req.body.prijs,
        req.body.cID,
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

router.patch("/:id",checkAuth, Admin, (req, res) => {
    let errors = [];
    if (!req.body) {
        res.status(400).json({ error: "No Body" });
        return;
    }
    if (req.body.pnaam) {
        var regex = /^[0-9A-Za-z\s\-]+$/;
        var valideer = req.body.pnaam.match(regex);
        if (!valideer) {
            errors.push("Naam bevatten alleen letters, cijfers, witruimtes en dashes(-).");
        }
    } else {

        errors.push("Geen code ingevuld");
    }
    if (req.body.pcode) {
        var regex = /^[0-9A-Za-z\s\-]+$/;
        var valideer = req.body.pcode.match(regex);
        if (!valideer) {
            errors.push("Productcode bevatten alleen letters, cijfers, witruimtes en dashes(-).");
        }
    } else {

        errors.push("Geen Productcode ingevuld");
    }


    if (req.body.pbeschrijving) {
        var regex = /^(.|\s)*[a-zA-Z]+(.|\s)*$/;
        var valideer = req.body.pbeschrijving.match(regex);
        if (!valideer) {
            errors.push("Product beschrijving bevat alleen letters, cijfers, witruimtes en dashes(-).");
        }
    } else {

        errors.push("Geen beschrijving ingevuld");
    }
    if (req.body.phoeveelheid) {
        var regex = /^[0-9]+$/;
        var valideer = req.body.phoeveelheid.match(regex);
        if (!valideer) {
            errors.push("aantallen bevatten alleen cijfers.");
        }
    } else {

        errors.push("Geen aantal ingevuld");
    }
    if (req.body.prijs) {
        var regex = /^[0-9]+$/;
        var valideer = req.body.prijs.match(regex);
        if (!valideer) {
            errors.push("prijzen bevatten alleen cijfers.");
        }
    } else {

        errors.push("Geen prijs ingevuld");
    }
    if (req.body.cID) {
        var regex = /^[0-4]+$/;
        var valideer = req.body.cID.match(regex);
        if (!valideer) {
            errors.push("Categorie bevatten alleen cijfers.");
        }
    } else {

        errors.push("Geen categorie ingevuld");
    }

    console.log(errors.length);

    if (errors.length) {
        res.status(400).json({ errors });

        return;
    }
    let qry = `UPDATE product set
    pnaam = coalesce(NULLIF(?,''),pnaam), 
    pcode = coalesce(NULLIF(?,''),pcode), 
    pbeschrijving = coalesce(NULLIF(?,''),pbeschrijving), 
    phoeveelheid = coalesce(NULLIF(?, ''),phoeveelheid), 
    prijs = coalesce(NULLIF(?, ''),prijs), 
    cID = coalesce(NULLIF(?, ''),cID)
    WHERE productID = ?`;

    let params = [
        req.body.pnaam,
        req.body.pcode,
        req.body.pbeschrijving,
        req.body.phoeveelheid,
        req.body.prijs,
        req.body.cID,
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

router.delete("/:id",checkAuth, Admin, (req, res) => {
    let qry = "DELETE FROM product WHERE productID = ?";
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