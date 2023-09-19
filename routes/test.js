const express = require("express");
require("dotenv").config();
const router = express.Router();

const db = require("../database/connection");

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
    const qry = 'select id,password from User WHERE IdEmail = ?'
    let params = [req.body.idEmail];

    db.all(qry, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        const data = rows[0]

        if (!data) {
            res.status(401).json({ error: 'invalid credentials' });
            return;
        }


        const paswordDB = data.password


        const isValid = bcrypt.compareSync(req.body.password, paswordDB)





        if (isValid) {

            const token = jwt.sign({ id: data.id }, process.env.ACCESS_TOKEN_SECRET)
                //       console.log(isValid);
            res.status(200);
            res.json({
                "token": token
            });

        } else {
            res.status(401).json({ error: 'invalid credentials' })
        }


    });
});








module.exports = router;