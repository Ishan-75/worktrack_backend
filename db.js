const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("worktrack.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Database connected");
  }
});

module.exports = db;