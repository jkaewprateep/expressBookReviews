const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//
const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});  
//

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    // added
    let myPromise1 = new Promise((resolve,reject) => {
        let books = require("./booksdb.js");
        return res.send(JSON.stringify(books,null,4));
        
    })
    myPromise1.then((successMessage) => {
        console.log("From Callback " + successMessage);
        myPromise1.reject();
        return
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    let myPromise1 = new Promise((resolve,reject) => {
    let books = require("./booksdb.js");
    return res.send(JSON.stringify(books[isbn],null,4));
    
    })
    myPromise1.then((successMessage) => {
        console.log("From Callback " + successMessage);
        myPromise1.reject();
        return
    })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;

    let answer = [];
    for (let i = 1; i <= Object.keys(books).length; i++) {
        if (books[i].author === author){
            answer.push(books[i]);
        }
    }

    res.send(JSON.stringify(answer,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
    let answer = [];

    let myPromise1 = new Promise((resolve,reject) => {
        let books = require("./booksdb.js");

        for (let i = 1; i <= Object.keys(books).length; i++) {
            if (books[i].title === title){
                answer.push(books[i]);
            }
        }
        res.send(JSON.stringify(answer,null,4));
    })

    myPromise1.then((successMessage) => {
        console.log("From Callback " + successMessage);
        myPromise1.reject();
        return
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

    const review = Number(req.params.isbn);

    res.send(JSON.stringify(books[review],null,4));
});

//
public_users.put("/review/:isbn", function (req, res) {
    const review = req.params.reviewadded;
    const isbn = req.params.isbn;
    let books = books[isbn][0];
    
    if (books.username === username) {
        books["reviews"] = isbn;
    }
    else{
        const current_review = books["reviews"];
        books["reviews"] = [current_review, isbn];
    }
    
    res.send(`Friend with the email  ${email} updated.`);

});
//

module.exports.general = public_users;