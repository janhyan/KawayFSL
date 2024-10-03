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
  const userId = req.query.user; // Extract user ID from the query parameter

  // Ensure the userId is provided
  if (!userId) {
    return res.status(400).send("Missing user ID");
  }

  db.any(
    `
    SELECT 
      m.module_id, 
      m.module_title, 
      m.module_description,
      COALESCE(ump.status, m.status) AS status
    FROM Modules m
    LEFT JOIN UsersModuleProgress ump
      ON m.module_id = ump.module_id
      AND ump.user_id = $1
    ORDER BY m.module_id;
    `,
    [userId]
  )
    .then((data) => {
      return res.json(data); // Return the retrieved data as JSON
    })
    .catch((err) => {
      return res.status(500).send(err); // Return an error message on failure
    });
});

app.get("/v1/:module/lessons", cors(corsOptions), (req, res) => {
  const userId = req.query.user; // Extract user ID from the query parameter
  const moduleId = req.params.module;

  // Ensure the userId is provided
  if (!userId) {
    return res.status(400).send("Missing user ID");
  }

  db.any(
    `
    SELECT 
      l.lesson_id,
      l.module_id,  
      l.lesson_title,
      l.lesson_description,
      l.video_url,
      l.lesson_content,
      l.assessment_id, 
      l.answers,
      COALESCE(ulp.status, l.status) AS status
    FROM Lessons l
    LEFT JOIN UsersLessonsProgress ulp
      ON l.lesson_id = ulp.lesson_id
      AND ulp.user_id = $2
    WHERE l.module_id = $1 
    ORDER BY l.lesson_id;
    `,
    [moduleId, userId] // Pass moduleId and userId as parameters to the query
  )
    .then((data) => {
      return res.json(data); // Return the retrieved data as JSON
    })
    .catch((err) => {
      return res.status(500).send(err); // Return an error message on failure
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
