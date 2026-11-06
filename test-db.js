const db = require("./db");

db.query("SHOW TABLES", (err, results) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(results);
    }

    db.end();
});