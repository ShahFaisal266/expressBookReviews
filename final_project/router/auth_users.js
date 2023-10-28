const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

//User data
let users = [ 
  {
  name:"Shah Faisal",
  password:"123456"
},{
  name:"Shah",
  password:"12345"
}
 ];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (name,password)=>{
  let validusers = users.filter((user)=>{
    return (user.name === name && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { name, password } = req.body;
  const userExists =  users.some(user => user.name === name);
  const userPasswordCorrect =  users.some(user => user.password === password);
  if (!userExists) {
    return res.status(400).json({ message: "Customer Not exists" });
  } 
  else if (!userPasswordCorrect) {
    return res.status(400).json({ message: "Password is  InCorrect" });
  }else {
    if (authenticatedUser(name,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,name
    }
    return res.status(200).send("Customer successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  }
 
});

//Add or Update review of authenticated user
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const name = req.session.authorization.name;
  const reviews = req.query.reviews;
    
  console.log(name)
  if (!isbn || !reviews || !name) {
    return res.status(400).json({ message: "Invalid request" });
  }
  // Find the book by ISBN
  const book = books[isbn];
  
  if (book) {
    
    if (!Array.isArray(book.reviews)) {
      book.reviews = [];
    }
    if (reviews) {
      
      const reviewIndex = book.reviews.findIndex((review) => review.name === name);

      if (reviewIndex!==-1) {
        
        book.reviews[reviewIndex].reviews = reviews;
        
      } else {
        // Add a new review for this book
        book.reviews.push({name:name,reviews:reviews});
      }
     
      return res.send(`The review for the book with ISBN ${isbn} has been added/updated.`);
    } else {
      return res.status(400).json({ message: "Missing 'reviews' query parameter" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
  
//delete review of authenticated user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const name = req.session.authorization.name;
  if (!isbn  || !name) {
    return res.status(400).json({ message: "Invalid request" });
  }
  
  const book = books[isbn];
  if (Array.isArray(book.reviews)) {
  const reviewIndex = book.reviews.findIndex((review) => review.name === name);
  if  (reviewIndex !== -1) {
      book.reviews.splice(reviewIndex, 1);
      return res.send(`The review for the book with ISBN ${isbn} has been deleted.`);
    } else {
      return res.status(400).json({ message: "Missing 'reviews' query parameter" });
    }
  }
  else{
    return res.status(400).json({ message: "No reviews" }); 
  }
});
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
