const app = require('express')();
const mongoose = require('./connection.js');
const bodyParser = require('body-parser')
const User = require("./models/User");
const MessageHistory = require("./models/MessageHistory");
const Account = require("./models/Account");
const Login = require("./models/Login");
const Chat = require("./models/Chat");

app.use(bodyParser.json())

app.get('/', (req,res)=>{
    User.find({}).then(users => {
        console.log(users)
    })
})

app.listen(4000, () =>{
    console.log("connected")
}) 