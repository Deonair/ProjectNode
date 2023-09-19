const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "database/webshop.db";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log(`Connected to the SQlite database "webshop".`);
    }
});

module.exports = db;


// const incustomers = `INSERT INTO "Klant"
// (voornaam, achternaam, telefoon, email) VALUES (?,?,?,?)`;

// db.run(incustomers, [

//         "Demarcus",

//         "Cousins",

//         "0612345610",

//         "DM@gmail.com",

//     ],

//     function() {

//         console.log('Record added to the table "Klant"');

//     }

// );


// const selectQuery = `SELECT * FROM "Klant"`; //(denk aan de backtick)

// db.all(selectQuery, function(err, rows) {
//     if (err) {
//         throw err;
//     }
//     console.log({
//         message: "success",
//         data: rows,
//     });
// });