//using router
const express = require('express')
const router = express.Router()
const mongoose = require("mongoose") 
require("dotenv").config()
// let prsnt = null //the thing
// var flagLogin = false;
// //database connection
// mongoose.connect(process.env.atlas1+process.env.atlas2+process.env.atlas3+process.env.atlas4)
// var db= mongoose.connection;
// db.on('error',()=>{console.log("Error in Connecting to Database")})
// db.once('open',()=>{console.log("Connected to Database in USERS")})
// const userSchema = new mongoose.Schema({Name: String,
//                                         password: String,
//                                         email: String})
// USER = mongoose.model("User", userSchema)


router.get("/",(req,res) =>{
    res.render("dashboard/dashboard")
   })



module.exports = router
