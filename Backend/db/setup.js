const fs = require('fs');

const sql = fs.readFileSync('./Backend/db/setup.sql').toString();
const db = require('./connect');

db.query(sql)
    .then(data => console.log("Set-up complete."))
    .catch(error => console.log(error));