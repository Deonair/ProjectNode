const express = require('express');
const router = express.Router();
const db = require('../database/db')

module.exports = (req, res, next) => {
    const user = req.user

    const role_id = user.role_id

    const isAdmin = role_id == 1

    console.log(role_id)

    if (!isAdmin) {
        return res.sendStatus(401)
    } else {
        next();
    }
};