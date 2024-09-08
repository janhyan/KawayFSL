const express = require("express");
const app = express();
const pgp = require("pg-promise");
const db = pgp(process.env.DATABASE)
const PORT = 8080;

app.get("/", (req, res) => {
    return res.send("Hello from Home Page");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})