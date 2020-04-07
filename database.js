var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"


let db = new sqlite3.Database('./diarios.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to database.');
});


module.exports = db
