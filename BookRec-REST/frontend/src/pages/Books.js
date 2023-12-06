import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// import ActiveUsers from "./ActiveUsers";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [username, setUsername] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [isUsernameEntered, setIsUsernameEntered] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8000/books");
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBooks();
  }, []);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/activeUsers");
        setActiveUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (isUsernameEntered) {
      fetchActiveUsers();
    }
  }, [isUsernameEntered]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/books/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleUsernameSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/user", {
        name: username,
      });
      setIsUsernameEntered(true);
    } catch (error) {
      console.log(error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Books Rec</h1>

      {/* User Input Form */}
      <form>
        <label htmlFor="username">Enter your username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleUsernameChange}
        />

        {/* Submit button for entering the username */}
        {!isUsernameEntered && (
          <button type="button" onClick={handleUsernameSubmit}>
            Enter
          </button>
        )}

        <br></br>

        {/* Display Active Users */}
        {isUsernameEntered && (
          <>
            <h2>Active Users:</h2>
            <ul>
              {activeUsers.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
          </>
        )}

        {/* Button to get recommendations */}
        {isUsernameEntered && (
          <>
            <button type="button" onClick={() => navigate("/recommendations")}>
              Get Recommendations
            </button>
            <br></br>
          </>
        )}

        {/* Button to add a new book */}
        <button className="addHome">
          <Link to="/add" style={{ color: "inherit", textDecoration: "none" }}>
            Add new book
          </Link>
        </button>
      </form>

      <div className="books">
        {books.map((book) => (
          <div key={book.id} className="book">
            <h3>{book.title},{book.author}</h3>
            <p>{book.genre}</p>
            <br></br>
            <button className="delete" onClick={() => handleDelete(book.id)}>
              Delete
            </button>
            <button className="update">
              <Link
                to={`/update/${book.id}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Update
              </Link>
            </button>
            <br></br>
          </div>
        ))}
        <br></br>
      </div>
    </div>
  );
};

export default Books;
