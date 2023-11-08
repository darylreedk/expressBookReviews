const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//check is the username is valid
const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if(userswithsamename.length>0) {
        return true;
    }
    else {
        return false;
    }
}

//check if username and password match one on file
const authenticatedUser = (username,password)=>{ //returns boolean
    let validUsers = users.filter((user)=> {
        return (user.username === username && user.password === password)
    });
    if(validUsers.length > 0) {
        return true;
    }
    else {
        return false;
    }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("Customer successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add or modify a book review with isbn based on registered user
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const review = req.query.review;

    if (username && review && isbn) {
        if (books[isbn]) {
            if (!books[isbn].reviews) {
                books[isbn].reviews = {};
            }

            books[isbn].reviews[username] = review;
            
            return res.status(200).json({ message: "The review for the book with ISBN " + isbn + " has been added/updated."});
        } else {
            return res.status(404).json({ message: "Book with ISBN " + isbn + " not found." });
        }
    }

    return res.status(400).json({ message: "Invalid request. Make sure to include ISBN number and review." });

});

//DELETE a review based on registered user
regd_users.delete("/auth/review/:isbn",(req,res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if(username && isbn) {
        if(books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "The review for the book with ISBN " + isbn + " from user " + username + " has been deleted."});
        }
        else {
            return res.status(404).json({message: "Review for book with ISBN " + isbn + " not found. "});
        }
    }
    return res.status(400).json({message: "Invalid request. Make sure to include ISBN number and ensure you're logged in."});
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
