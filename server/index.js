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

app.get("/", (req, res) => {
  db.any("SELECT * FROM Lessons")
    .then((data) => {
      return res.send(data);
    })
    .catch((err) => {
      return res.send(err);
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
