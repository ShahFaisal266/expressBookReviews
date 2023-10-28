const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const bookKeys = Object.keys(books);

public_users.post("/register", (req, res) => {
  const { name, password } = req.body;
  const userExists =  users.some(user => user.name === name);
 
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  } else {
    // Add the new user to the users array
    users.push({"name":name,"password":password});
    return res.send("Customer successfully Registered !" + (' ')+ (req.body.name) + " Please Login")
  }
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try
  {
    return res.send(JSON.stringify(books));
  }
  catch
  {
    return res.status(400).json("Error");
  }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbnNumber=req.params.isbn;

  if(books[isbnNumber])
  {
    return res.send(JSON.stringify(books[isbnNumber]));
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  const matchingBooks =[];
  let  bookNumber=0;
  for (const bookId of bookKeys) {
    bookNumber = bookId;
    if (books[bookId].author === authorName) {
      const matchingBook = {
        isbn:bookNumber,
        title: books[bookId].title,
        reviews: books[bookId].reviews,
        // Add other properties you want to include here
      };
      matchingBooks.push(matchingBook);
     
    }
  }

  if (matchingBooks.length > 0) {
    // If matching books are found, respond with an array of matching books
    const response = { booksByauthor: matchingBooks };
    res.send(JSON.stringify(response));
  } else {
    // If no matching books are found, return a 404 Not Found response
    res.status(404).json({ message: "No books by the specified author found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleName = req.params.title;
  const matchingtitleName =[];
  let  bookNumber=0;
  for (const bookId of bookKeys) {
    bookNumber=bookId;
    if (books[bookId].title === titleName) {
      const matchingBook = {
        isbn:bookNumber,
        author: books[bookId].author,
        reviews: books[bookId].reviews,
        // Add other properties you want to include here
      };
      matchingtitleName.push(matchingBook);
      
    }
  }

  if (matchingtitleName.length > 0) {
    // If matching books are found, respond with an array of matching books
    const response = { booksByTtile: matchingtitleName };
    res.send(JSON.stringify(response));
  } else {
    // If no matching books are found, return a 404 Not Found response
    res.status(404).json({ message: "No books by the specified author found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbnNumber=req.params.isbn;

  if(books[isbnNumber])
  {
    return res.send(JSON.stringify(books[isbnNumber].reviews));
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//Get listof books by using callbacks and async/await 
public_users.get('/listbooks', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000');
    res.send(JSON.stringify(response.data));
  } catch (error) {
    res.status(400).json("Error");
  }
});

//Get Booksdetail by ISBN using callbacks and async/await 
public_users.get('/listbooks/isbn/:isbn', async function (req, res) {
  try {
   const isbn=req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    
    res.send(JSON.stringify(response.data));
  } catch (error) {
    
    res.status(400).json("Error");
  }
});

//Get Booksdetail by author using callbacks and async/await 
public_users.get('/listbooks/author/:author', async function (req, res) {
  try {
   const author=req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
   
    
    res.send(JSON.stringify(response.data));
  } catch (error) {
    
    res.status(400).json("Error");
  }
});

//Get Booksdetail by Title using callbacks and async/await 
public_users.get('/listbooks/title/:title', async function (req, res) {
  try {
   const title=req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    
    
    res.send(JSON.stringify(response.data));
  } catch (error) {
    
    res.status(400).json("Error");
  }
});
module.exports.general = public_users;
