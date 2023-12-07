
import { listen } from 'soap';
import mysql from 'mysql';
import { readFileSync } from 'fs';
import express from "express";

const bookdb = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "bookrec",
  });

const checkUserInDatabase = (name) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE name = ?';
      
      bookdb.query(query, [name], (error, results) => {
        if (error) {
          console.error('MySQL error:', error);
          reject(error);
        } else {
          // If there is at least one result, the user exists
          const userExists = results.length > 0;
          resolve(userExists);
        }
      });
    });
  };
  

const addUserToDatabase = (name) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (name) VALUES (?)';
  
      bookdb.query(query, [name], (error, results) => {
        if (error) {
          console.error('MySQL error:', error);
          reject(error);
        } else {
          // If the query is successful, the user is added to the database
          const userAdded = results.affectedRows > 0;
          resolve(userAdded);
        }
      });
    });
  };
  

const getAllBooksFromDatabase = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM books';
  
      bookdb.query(query, (error, results) => {
        if (error) {
          console.error('MySQL error:', error);
          reject(error);
        } else {
          // If the query is successful, return the array of books
          resolve(results);
        }
      });
    });
  };
  

const addNewBookToDatabase = (title, author, genre) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO books (title, author, genre) VALUES (?, ?, ?)';
  
      bookdb.query(query, [title, author, genre], (error, results) => {
        if (error) {
          console.error('MySQL error:', error);
          reject(error);
        } else {
          // If the query is successful, the new book is added to the database
          const bookAdded = results.affectedRows > 0;
          resolve(bookAdded);
        }
      });
    });
  };
  

const getBooksByGenreFromDatabase = (genre) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM books WHERE genre = ?';
  
      bookdb.query(query, [genre], (error, results) => {
        if (error) {
          console.error('MySQL error:', error);
          reject(error);
        } else {
          // If the query is successful, return the array of books for the specified genre
          resolve(results);
        }
      });
    });
  };
  

const deleteBookFromDatabase = (id) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM books WHERE id = ?';
  
      bookdb.query(query, [id], (error, results) => {
        if (error) {
          console.error('MySQL error:', error);
          reject(error);
        } else {
          // If the query is successful, the book is deleted from the database
          const bookDeleted = results.affectedRows > 0;
          resolve(bookDeleted);
        }
      });
    });
  };
  

  const userService = {
    UserPort: {
      User: {
        CheckUser: async (args) => {
          const { name } = args;
          try {
            const userExists = await checkUserInDatabase(name);
            return { success: userExists, message: userExists ? 'User login successful' : 'User not found' };
          } catch (error) {
            console.error('Error checking user:', error);
            throw new Error('Internal server error');
          }
        },
        AddUser: async (args) => {
          const { name } = args;
          try {
            const userAdded = await addUserToDatabase(name);
            return { success: userAdded, message: userAdded ? 'User added to the database' : 'Failed to add user' };
          } catch (error) {
            console.error('Error adding user:', error);
            throw new Error('Internal server error');
          }
        },
        GetBooks: async () => {
          try {
            const books = await getAllBooksFromDatabase();
            return { success: true, books };
          } catch (error) {
            console.error('Error getting books:', error);
            throw new Error('Internal server error');
          }
        },
        AddNewBook: async (args) => {
          const { title, author, genre } = args;
          try {
            const bookAdded = await addNewBookToDatabase(title, author, genre);
            return { success: bookAdded, message: bookAdded ? 'Book added successfully' : 'Failed to add book' };
          } catch (error) {
            console.error('Error adding book:', error);
            throw new Error('Internal server error');
          }
        },
        GetBooksByGenre: async (args) => {
          const { genre } = args;
          try {
            const booksByGenre = await getBooksByGenreFromDatabase(genre);
            return { success: true, books: booksByGenre };
          } catch (error) {
            console.error('Error getting books by genre:', error);
            throw new Error('Internal server error');
          }
        },
        DeleteBook: async (args) => {
          const { id } = args;
          try {
            const bookDeleted = await deleteBookFromDatabase(id);
            return { success: bookDeleted, message: bookDeleted ? 'Book deleted successfully' : 'Failed to delete book' };
          } catch (error) {
            console.error('Error deleting book:', error);
            throw new Error('Internal server error');
          }
        },
      },
    },
  };
  
const createSoapService = async () => {
  try {
    const wsdlOptions = {
      attributesKey: 'attributes',
    };

    const xml = readFileSync('user-service.wsdl', 'utf8');
    const server = express();
    const port = 8001;

    const soapServer = await listen(server, '/wsdl', userService, xml, wsdlOptions);
    server.listen(port, () => {
      console.log(`SOAP service listening at http://localhost:${port}/wsdl`);
    });

    return soapServer;
  } catch (error) {
    console.error('Error initializing SOAP service:', error);
    console.error('Error stack trace:', error.stack);
  }
};

export default createSoapService;

