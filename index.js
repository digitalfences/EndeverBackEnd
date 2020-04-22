const app = require('express')();
const bodyParser = require('body-parser')
const User = require("./db/models/User.js");
const Account = require("./db/models/Account.js");
const Login = require("./db/models/Login.js");

app.use(bodyParser.json())
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
});

app.get('/', (req,res) =>{
    res.redirect('/users');
})

app.get('/users', (req,res)=>{
    User.find().populate('Login').populate('Account').then(user => res.json(user))
})
app.get('/account/name/:userName', (req,res)=>{
    User.find({UserName : req.params.userName}).populate('Login').populate('Account').then(user => res.json(user))
})
app.get('/account/id/:id', (req,res)=> {
    User.find({_id: req.params.id}).populate('Login').populate('Account').then(user => res.json(user))
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
app.put('/users/:id', (req,res) =>{
    User.findOneAndUpdate({_id: req.params.id}, req.body).then(user => {
        res.json(user)
    })
})

app.delete('/users/:id', (req,res) =>{
    User.findOneByDelete({_id: req.params.id}).then(user => res.json(user))
})

app.set('port', process.env.PORT || 8080)

app.listen(app.get('port'), () => console.log(`PORT: ${app.get('port')}`))