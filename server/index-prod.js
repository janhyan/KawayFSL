const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const dbConfig = require("./db.config");

const corsOptions = {
  origin: "https://www.kawayfsl.com",
  optionSuccessStatus: 200,
  credentials: true,
};

const pgp = require("pg-promise")();
const connection = {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  database: dbConfig.DB,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
};
const db = pgp(connection);
const PORT = process.env.SERVER_PORT;

app.get("/nodejs/health/check", (req, res, next) => {
  res.send("Health check confirmed");
});

app.get("/v1/modules", cors(corsOptions), (req, res) => {
  db.any("SELECT * FROM Modules ORDER BY module_id ASC")
    .then((data) => {
      console.log(req.params.user)
      return res.json(data);
    })
    .catch((err) => {
      return res.send(err);
    });
});

app.get("/v1/:module/lessons", cors(corsOptions), (req, res) => {
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
