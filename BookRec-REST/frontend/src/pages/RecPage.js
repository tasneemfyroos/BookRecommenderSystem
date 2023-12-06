// RecPage.js

import React, { useState } from 'react';

const RecPage = () => {
  const [genre, setGenre] = useState('Fiction');
  const [books, setBooks] = useState([]);

  const getBooksByGenre = async () => {
    try {
      const response = await fetch(`http://localhost:8000/books/genre/${genre}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div>
      <h1>Book Recommendation App</h1>

      <form>
        <label htmlFor="genre">Select Genre:</label>
        <select id="genre" name="genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Mystery">Mystery</option>
        </select>
        <button type="button" onClick={getBooksByGenre}>Get Books</button>
      </form>

      <h2>Books in {genre} genre:</h2>
      <ul>
        {books.map(book => (
          <li key={book.id}>{book.title} by {book.author}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecPage;
