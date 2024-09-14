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
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  database: dbConfig.DB,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
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
