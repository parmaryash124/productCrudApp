const mysql = require("mysql");
const con = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "crudprod",
  dateStrings: "date",
});

module.exports = con;
