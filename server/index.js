const express = require("express");
const app = express();
require("dotenv").config();

const pgp = require("pg-promise")();
const connection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};
const db = pgp(connection);
const PORT = 8080;

app.get("/v1/modules", (req, res) => {
  db.any("SELECT * FROM Modules")
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      return res.send(err);
    });
});

app.get("/v1/:module/lessons/"), (req, res) => {
    db.any('SELECT * FROM Lessons WHERE module_id = $1', [req.params.module])
    .then((data) => {
        return res.json(data)
    })
    .catch((err) => {
        return res.send(err)
    })
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

