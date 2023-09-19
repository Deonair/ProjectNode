const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('boeken.db', function(err) {

      
    if (err) {

             throw err;

           }

    console.log("Database connected");

});

const createTable = `CREATE TABLE "auteurs" ( 

    "auteur_id" INTEGER NOT NULL, 
    
    "voornaam" TEXT NOT NULL, 
    
    "tussenvoegsels" TEXT, 
    
    "achternaam" TEXT NOT NULL, 
    
    "geboortedatum" TEXT NOT NULL, 
    
    "nationaliteit" TEXT NOT NULL, 
    
    "linkedin_url" TEXT, 
    
    "facebook_url" TEXT, 
    
    PRIMARY KEY("auteur_id" AUTOINCREMENT) 
    
    )`;

// db.run(createTable, function(error) {

//     if (error) {

//         throw error;

//         console.log("Table already exist");

//     }

//     console.log('Table "auteurs" created');

// });

// Creating some rows 

const insertRecord = `INSERT INTO "auteurs" 

(voornaam, tussenvoegsels, achternaam, geboortedatum, nationaliteit, linkedin_url, facebook_url) 

VALUES (?,?,?,?,?,?,?)`;



// db.run(insertRecord, [

//         "Maarten",

//         "'t'",

//         "Hart",

//         "25-11-1944",

//         "Nederlands",

//         "https://www.linkedin/MaartentHart",

//         "https://www.facebook.com/MaartentHart",

//     ],

//     function() {

//         console.log('Record added to the table "auteurs"');

//     }

// );
const selectQuery = `SELECT * FROM auteurs`;



db.all(selectQuery, function(err, rows) {

    if (err) {

        throw err;

    }

    console.log({

        message: "success",

        data: rows,

    });

});