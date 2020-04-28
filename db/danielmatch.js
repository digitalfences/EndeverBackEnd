const mongoose = require('./connection.js')
const User = require('./models/User.js')
const Login = require('./models/Login.js')
const Account = require('./models/Account.js')

User.find({UserName: "Daniel-Edminster"}).then(daniel => {
    let userArray = [];
    User.find({_id : { $ne: daniel._id } }).then (users => {
        users.forEach((user) => {
            userArray.push(user._id)
        })
    })
    Account.findOneAndUpdate({_id: daniel.Account}, {MatchedUsers: userArray}).then(danielAccount => {
        res.json(danielAccount)
    })
})