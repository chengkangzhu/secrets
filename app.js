//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
});

userSchema.plugin(encrypt,{secret:process.env.SECRET_KEY, encryptedFields:['password']})

const User = mongoose.model("user", userSchema);

//home sectoin
app.route("/").get((req, res) => {
  res.render("home");
});

//login section
app
  .route("/login")

  .get((req, res) => {

    res.render("login");
  })

  .post((req, res) => {
    const userEmail = req.body.username;
    const userPassword = req.body.password;

    User.findOne({email: userEmail},(err,foundUser)=>{
      if(err){
        console.log(err)
      } else {
        if(foundUser.password == userPassword){
          res.render("secrets")
        } else {
          console.log('correct email but wrong password bro')
        }
      }
    })
  });

//register section
app
  .route("/register")

  .get((req, res) => {
    res.render("register");
  })

  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });

    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

app.listen(3000, () => {
  console.log("server running on port 3000");
});
