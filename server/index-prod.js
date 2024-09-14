const express = require("express");
const app = express();
const cors = require('cors')
require("dotenv").config();
const dbConfig = require("./db.config");

const corsOptions = {
  origin: 'http://localhost:3000',
  optionSuccessStatus: 200,
  credentials: true
}

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

app.get("/v1/modules", cors(corsOptions), (req, res) => {
  db.any("SELECT * FROM Modules ORDER BY module_id ASC")
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      return res.send(err);
    });
});

app.get("/v1/:module/lessons", cors(corsOptions),
  (req, res) => {
    db.any("SELECT * FROM Lessons WHERE module_id = $1", [req.params.module])
      .then((data) => {
        return res.json(data);
      })
      .catch((err) => {
        return res.send(err);
      });
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
