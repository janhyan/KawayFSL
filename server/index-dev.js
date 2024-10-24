const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const dbConfig = require("./db.config");

const corsOptions = {
  origin: "http://localhost:3000",
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
};
const db = pgp(connection);
const PORT = process.env.SERVER_PORT;

app.get("/nodejs/health/check", (req, res, next) => {
  res.send("Health check confirmed");
});

app.get("/v1/modules", cors(corsOptions), (req, res) => {
  const userId = req.query.user; // Extract user ID from the query parameter
  console.log(userId);

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
      console.log(data);
      return res.json(data); // Return the retrieved data as JSON
    })
    .catch((err) => {
      console.log(err);
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
      console.log(data);
      return res.json(data); // Return the retrieved data as JSON
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err); // Return an error message on failure
    });
});

app.options("/v1/unlock/:module/:lesson/", cors(corsOptions));
app.put("/v1/unlock/:module/:lesson/", cors(corsOptions), async (req, res) => {
  const userId = req.query.user; // Extract user ID from the query parameter
  const moduleId = req.params.module;
  const lessonId = req.params.lesson;

  if (!userId) {
    return res.status(400).send("Missing user ID");
  }

  try {
    // Find the next lesson in the same module
    const nextLesson = await db.oneOrNone(
      `
      SELECT lesson_id 
      FROM Lessons 
      WHERE module_id = $1 
      AND lesson_id > $2 
      ORDER BY lesson_id ASC 
      LIMIT 1;
    `,
      [moduleId, lessonId]
    );

    if (nextLesson) {
      // Check if the next lesson is already unlocked
      const lessonProgress = await db.oneOrNone(
        `
        SELECT status
        FROM UsersLessonsProgress
        WHERE user_id = $1 AND lesson_id = $2 AND status = TRUE;
      `,
        [userId, nextLesson.lesson_id]
      );

      if (!lessonProgress) {
        // Unlock the next lesson if not already unlocked
        await db.none(
          `
          INSERT INTO UsersLessonsProgress (user_id, lesson_id, status)
          VALUES ($1, $2, TRUE);
        `,
          [userId, nextLesson.lesson_id]
        );

        return res.json({
          message: "Next lesson unlocked",
          lessonId: nextLesson.lesson_id,
        });
      } else {
        return res.json({
          message: "Lesson already unlocked",
          lessonId: nextLesson.lesson_id,
        });
      }
    } else {
      // If no higher lesson, unlock the next module and its first lesson
      const nextModule = await db.oneOrNone(
        `
        SELECT module_id 
        FROM Modules 
        WHERE module_order = (
          SELECT module_order 
          FROM Modules 
          WHERE module_id = $1
        ) + 1;
      `,
        [moduleId]
      );

      if (nextModule) {
        // Unlock next module
        const moduleProgress = await db.oneOrNone(
          `
          SELECT status
          FROM UsersModuleProgress
          WHERE user_id = $1 AND module_id = $2 AND status = TRUE;
        `,
          [userId, nextModule.module_id]
        );

        if (!moduleProgress) {
          await db.none(
            `
            INSERT INTO UsersModuleProgress (user_id, module_id, status)
            VALUES ($1, $2, TRUE);
          `,
            [userId, nextModule.module_id]
          );
        }

        // Unlock the first lesson in the next module
        const firstLesson = await db.one(
          `
          SELECT lesson_id 
          FROM Lessons 
          WHERE module_id = $1 
          ORDER BY lesson_order ASC 
          LIMIT 1;
        `,
          [nextModule.module_id]
        );

        const firstLessonProgress = await db.oneOrNone(
          `
          SELECT status
          FROM UsersLessonsProgress
          WHERE user_id = $1 AND lesson_id = $2 AND status = TRUE;
        `,
          [userId, firstLesson.lesson_id]
        );

        if (!firstLessonProgress) {
          await db.none(
            `
            INSERT INTO UsersLessonsProgress (user_id, lesson_id, status)
            VALUES ($1, $2, TRUE);
          `,
            [userId, firstLesson.lesson_id]
          );
        }

        return res.json({
          message: "Next module and first lesson unlocked",
          moduleId: nextModule.module_id,
          lessonId: firstLesson.lesson_id,
        });
      } else {
        return res.status(400).json({ message: "No next module available" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

app.get("/v1/latest-module", cors(corsOptions), (req, res) => {
  userId = req.query.user;

  // Ensure the userId is provided
  if (!userId) {
    return res.status(400).send("Missing user ID");
  }

  db.one(
    `
    SELECT *
    FROM Modules m
    JOIN UsersModuleProgress ump ON m.module_id = ump.module_id
    WHERE ump.user_id = $1
    AND ump.status = TRUE
    ORDER BY module_order DESC
    LIMIT 1;
    `,
    [userId]
  )

    .then((data) => {
      console.log(data);
      return res.json(data); // Return the retrieved data as JSON
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err); // Return an error message on failure
    });
});

app.get("/v1/latest-lessons", cors(corsOptions), (req, res) => {
  userId = req.query.user;

  // Ensure the userId is provided
  if (!userId) {
    return res.status(400).send("Missing user ID");
  }

  db.any(
    `
    SELECT *
    FROM Lessons l
    JOIN UsersLessonsProgress ulp ON l.lesson_id = ulp.lesson_id
    WHERE ulp.user_id = $1
    AND ulp.status = TRUE
    ORDER BY lesson_order DESC
    LIMIT 3;
    `,
    [userId]
  )

    .then((data) => {
      console.log(data);
      return res.json(data); // Return the retrieved data as JSON
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err); // Return an error message on failure
    });
});

app.get("/v1/notifications", cors(corsOptions), (req, res) => {
  userId = req.query.user;

  // Ensure the userId is provided
  if (!userId) {
    return res.status(400).send("Missing user ID");
  }

  db.any(
    `
    SELECT *
    FROM Notifications
    WHERE user_id = $1
    AND status = TRUE
    ORDER BY notification_id DESC
    LIMIT 10;
    `,
    [userId]
  )
    .then((data) => {
      console.log(data);
      return res.json(data); // Return the retrieved data as JSON
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err); // Return an error message on failure
    });
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
