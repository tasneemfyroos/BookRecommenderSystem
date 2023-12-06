import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());




const bookdb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "bookrec",
});

app.post('/user', (req, res) => {
  const { name } = req.body;

  bookdb.query('SELECT * FROM users WHERE name = ?', [name], (error, results) => {
    if (error) {
      console.error('MySQL error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else if (results.length > 0) {
      // User exists, respond with success message
      res.json({ success: true, message: 'User login successful' });
    } else {
      // User doesn't exist, add them to the database
      bookdb.query('INSERT INTO users (name) VALUES (?)', [name], (insertError) => {
        if (insertError) {
          console.error('MySQL error:', insertError);
          res.status(500).json({ success: false, message: 'Failed to add user to the database' });
        } else {
          res.json({ success: true, message: 'User added to the database' });
        }
      });
    }
  });
});

app.get('/activeUsers', (req, res) => {
  // Assuming you have a 'users' table in your database
  const query = 'SELECT name FROM users';

  bookdb.query(query, (error, results) => {
    if (error) {
      console.error('MySQL error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      const activeUsers = results.map((user) => user.name);
      res.json(activeUsers);
    }
  });
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

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = " DELETE FROM books WHERE id = ? ";

  bookdb.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title`= ?, `author`= ?, `genre`= ?  WHERE id = ?";

  const values = [
    req.body.title,
    req.body.author,
    req.body.genre,
  ];

  bookdb.query(q, [...values,bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});



app.get("/books/genre/:genre", (req, res) => {
  const genre = req.params.genre;
  const q = "SELECT * FROM books WHERE genre = ?";

  bookdb.query(q, [genre], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});




app.listen(8000, () => {
  console.log("Connected to server");
});