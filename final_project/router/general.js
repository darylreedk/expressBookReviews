const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//register new users
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Customer successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop with promise/callback functions
public_users.get('/',function (req, res) {
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({books});
        }, 1000)
    })
    .then(data => {
        res.send(JSON.stringify(data, null, 4))
    })
});

// Get book details based on ISBN with promise/callback functions
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filtered_isbn = null;
    for (let key in books) {
        if (key === isbn) {
            filtered_isbn = books[key];
            break;
        }
    }

    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({filtered_isbn})
        }, 5000)
    })
    .then(data => {
        res.send(filtered_isbn);
    })
});

// Get book details based on author with promise/callback functions
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filtered_author = null;
    for(let key in books)
    {
        if(books[key].author === author) {
            filtered_author = books[key];
            break;
        }
    }
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({filtered_author})
        }, 5000)
    })
    .then(data => {
        res.send(filtered_author)
    })
});

// Get all books based on title with promise/ callback functions
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    filtered_title = null;
    for( let key in books) {
        if(books[key].title === title) {
            filtered_title = books[key];
            break;
        }
    }
    
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({filtered_title})
        }, 5000)
    })
    .then(data => {
        res.send(filtered_title);
    })
});

//  Get book review using isbn with promise/callback functionality
public_users.get('/review/:isbn',function (req, res) {
    const review = req.params.isbn;
    filtered_review = null;
    for(let key in books) {
        if(key === review) {
            filtered_review = books[key].reviews;
            break;
        }
    }

    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({filtered_review})
        }, 5000)
    })
    .then(data => {
        res.send(filtered_review);
    })
});

module.exports.general = public_users;
