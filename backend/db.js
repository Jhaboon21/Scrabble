"use strict";
/** Database setup for scrabble. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

// host/databse is for connecting to db locally, connectionString is for connecting to online db service
if (process.env.NODE_ENV === "production") {
  db = new Client({
    // host: "/var/run/postgresql/",
    // database: getDatabaseUri(),
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = new Client({
    // host: "/var/run/postgresql/",
    // database: getDatabaseUri()
    connectionString: getDatabaseUri()
  });
}

db.connect() 
.then(() => { console.log('Connected to PostgreSQL database!') }) 
.catch((err) => { console.error('Error connecting to the database:', err); 
});

module.exports = db;
