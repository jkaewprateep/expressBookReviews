const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const authenticatedUser = (username,password)=>{
    let users = require("./router/auth_users.js").users;
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

const app = express();

app.use(express.json());
app.use(express.json());
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    if(req.session.authorization) {
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
        });
    } else {
        return res.status(403).json({message: "User not logged in"})
    }
});

//
app.post("/reviewadd/", (req,res) => {
    const reviewadd = req.body.reviews;
    const isbn = Number(req.body.isbn);

    let answer = [];
    let books = require("./router/booksdb.js");
    const current_review = books[isbn].reviews;
    books[isbn].reviews = [current_review, reviewadd];


    res.send(JSON.stringify(books[isbn],null,4));

});
//

app.post("/customer/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 });

    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

//
app.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (isbn){
        let books = require("./router/booksdb.js");

        // delete books[isbn].reviews;
        books[isbn].reviews = {};
    }
    res.send(`Book reviews with the isbn  ${isbn} deleted.`);
});
//
 
const PORT = 5000;

app.use("/", genl_routes);
app.use("/register", genl_routes);
app.use("/customer", customer_routes);

app.listen(PORT,()=>console.log("Server is running"));
