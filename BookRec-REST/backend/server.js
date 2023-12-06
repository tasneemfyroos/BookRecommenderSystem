import express from "express";
import mysql from "mysql";

const app = express();

const bookdb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "bookrec",
});

app.get("/", (req, res) => {
  res.json("hello");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  bookdb.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  const q = "INSERT INTO books(`title`, `author`, `genre`) VALUES (?)";

  const values = [
    req.body.title,
    req.body.author,
    req.body.genre,
  ];

  bookdb.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});


app.listen(8000, () => {
  console.log("Connected to server");
});