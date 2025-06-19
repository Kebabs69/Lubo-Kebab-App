const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./users.db");

db.serialize(() => {
  db.all("SELECT email FROM users", (err, rows) => {
    if (err) {
      console.error("Error reading users:", err);
      process.exit(1);
    }

    if (rows.length === 0) {
      console.log("No users found.");
    } else {
      console.log("Registered emails:");
      rows.forEach((row) => console.log(row.email));
    }

    db.close();
  });
});