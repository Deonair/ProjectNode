const express = require('express');
const router = express.Router();
const db = require('../database/db')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const checkAuth = require("../middleware/checkAuth");


router.post("/", (req, res) => {
    const qry = 'select wachtwoord, userID,rolID FROM users WHERE email = ?'

    let params = [req.body.email];

    db.all(qry, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        const data = rows[0]
        console.log(data);
        if (!data) {
            res.status(401).json({ error: 'invalid credentials' });
            return;
        }


        const wachtwoordDB = data.wachtwoord


        const isValid = bcrypt.compareSync(req.body.wachtwoord, wachtwoordDB)





        if (isValid) {


            console.log(data)

            const user = {
                id: data.userID,
                role_id: data.rolID
            }

            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
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