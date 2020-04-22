const app = require('express')();
const bodyParser = require('body-parser')
const User = require("./models/User");
const MessageHistory = require("./models/MessageHistory");
const Account = require("./models/Account");
const Login = require("./models/Login");
const Chat = require("./models/Chat");
const express = require('express')

app.use(bodyParser.json())
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
});

app.get('/users', (req,res)=>{
    User.find().populate('Login').populate('Account').then(user => res.json(user))
})
 /**
  * req.body
  * {
  *    Login: {
  *         Token: '',
  *         Name: ''
  *     }
  *    Account: {
  *         Picture: '',
  *         Bio: '',
  *         Repositories: ['']
  *     }
  * }
  */
app.post('/', (req,res) => {
    let login = new Login({
        Username: req.body.Login.Username, 
        Token: req.body.Login.Token
    })
    let repoArray = [];
    repoArray.push(...req.body.Account.Repositories)
    let account = new Account({
        Picture: req.body.Account.Picture,
        Bio: req.body.Account.Bio,
        Repositories: repoArray
    })
    let user = {
        Login : login._id,
        Account : account._id
    }
    User.create(user).then(responseData=>{
        console.log(responseData);
    })
    Login.create(login);
    Account.create(account);
})

app.set('port', process.env.PORT || 8080)

app.listen(app.get('port'), () => console.log(`PORT: ${app.get('port')}`))