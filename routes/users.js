const express = require('express');
const router = express.Router();
const db = require('../database/db')
const bcrypt = require('bcrypt')
const CheckAuth = require('../middleware/checkAuth')
const Admin = require('../middleware/admin')

router.post("/", (req, res) => {
    let errors = [];
    if (!req.body.voornaam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.voornaam.match(regex);
        if (!valideer) {
            errors.push("Geen voornaam ingevuld");
        }
    }

    if (!req.body.achternaam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.achternaam.match(regex);
        if (!valideer) {
            errors.push("Geen achternaam ingevuld");
        }
    }
    if (!req.body.adres) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.adres.match(regex);
        if (!valideer) {
            errors.push("Geen adres ingevuld");
        }
    }
    if (!req.body.postcode) {
        var regex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
        var valideer = req.body.postcode.match(regex);
        if (!valideer) {
            errors.push("Geen postcode ingevuld");
        }
    }
    if (!req.body.woonplaats) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.woonplaats.match(regex);
        if (!valideer) {
            errors.push("Geen woonplaats ingevuld");
        }
    }
    if (!req.body.email) {
        var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        var valideer = req.body.email.match(regex);
        if (!valideer) {
            errors.push("Geen email ingevuld");
        }
    }
    if (!req.body.wachtwoord) {
        var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
        var valideer = req.body.password.match(regex);
        if (!valideer) {
            errors.push("Geen wachtwoord ingevuld");
        }
    }

    if (!bcrypt.hashSync(req.body.country, 10)) {
        errors.push("Geen country ingevuld");
    }


    console.log(errors.length);
    if (errors.length) {
        res.status(400).json({ errors });
        return;
    }

    let qry = `INSERT INTO "users"
	(voornaam, tussenvoegsel, achternaam, adres, postcode, woonplaats, email, rolID, countryID, wachtwoord )
	VALUES (?,?,?,?,?,?,?,?,?,?)`;

    let params = [
        req.body.voornaam,
        req.body.tussenvoegsel,
        req.body.achternaam,
        req.body.adres,
        req.body.postcode,
        req.body.woonplaats,
        req.body.email,
        req.body.rolID = 2,
        req.body.country,
        bcrypt.hashSync(req.body.wachtwoord, 10)
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

router.get('/', CheckAuth, Admin, (req, res) => {


    const qry = "SELECT voornaam, tussenvoegsel, achternaam, adres, postcode, woonplaats, email, countryID from users"
    const params = [req.params.id];

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

router.patch("/:id", CheckAuth, Admin, (req, res) => {
    let errors = [];

    if (!req.body.voornaam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.voornaam.match(regex);
        if (!valideer) {
            errors.push("Geen voornaam ingevuld");
        }
    }

    if (!req.body.achternaam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.achternaam.match(regex);
        if (!valideer) {
            errors.push("Geen achternaam ingevuld");
        }
    }
    if (!req.body.adres) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.adres.match(regex);
        if (!valideer) {
            errors.push("Geen adres ingevuld");
        }
    }
    if (!req.body.postcode) {
        var regex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
        var valideer = req.body.postcode.match(regex);
        if (!valideer) {
            errors.push("Geen postcode ingevuld");
        }
    }
    if (!req.body.woonplaats) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.woonplaats.match(regex);
        if (!valideer) {
            errors.push("Geen woonplaats ingevuld");
        }
    }
    if (!req.body.email) {
        var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        var valideer = req.body.email.match(regex);
        if (!valideer) {
            errors.push("Geen email ingevuld");
        }
    }



    let qry = `UPDATE users set
    voornaam = coalesce(NULLIF(?,''),voornaam), 
    tussenvoegsel = coalesce(NULLIF(?,''),tussenvoegsel), 
    achternaam = coalesce(NULLIF(?,''),achternaam), 
    adres = coalesce(NULLIF(?, ''),adres), 
    postcode = coalesce(NULLIF(?, ''),postcode), 
    woonplaats = coalesce(NULLIF(?, ''),woonplaats), 
    email = coalesce(NULLIF(?, ''),email), 
    countryID = coalesce(NULLIF(?, ''),countryID) 
    WHERE userID = ?`;

    let params = [
        req.body.voornaam,
        req.body.tussenvoegsel,
        req.body.achternaam,
        req.body.adres,
        req.body.postcode,
        req.body.woonplaats,
        req.body.email,
        req.body.countryID,
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
module.exports = router;