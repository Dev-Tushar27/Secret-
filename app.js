//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 =  require("md5");
require("dotenv").config();
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Using encryption

userSchema.plugin(encrypt , {secret:process.env.SECRET, encryptedFields:["password"]})

// const secretSchema = new mongoose.Schema({
//     secret:String
// });
 
const User = mongoose.model("User", userSchema);
// const Secret = mongoose.model("Secret",secretSchema);
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/logout",(req,res)=>{
    res.redirect("/");
});

app.get("/submit",(req,res)=>{
    res.render("submit");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("new user added");
        }
    });
    res.render("secrets");
})

app.post("/login", (req, res) => {
    const inputName = req.body.username;
    const inputPass = md5(req.body.password);

    User.findOne({
        email: inputName
    }, function(err, founduser){
        if (err) {
            console.log(err);
        } else {
            if (founduser.password === inputPass) {
                res.render("secrets");
            }else{
                console.log("Incorrect password");
            }
        }
    });
});

// app.post("/submit",(req,res)=>{
//     const newSecret = new Secret({
//         secret: req.body.secret
//     })

//     newSecret.save();
//     res.render("secrets");
// })



app.listen(3000, () => {
    console.log("Server started on port 3000");
});