const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const GitHubStrategy = require("passport-github2").Strategy;
<<<<<<< HEAD
const userRouter = require("./db/routes/userRouter");
const utilFunctions = require("./db/utilFunctions");
const configs = require("./db/configs");

// const GITHUB_CLIENT_ID = "fda597fe607c7161f2a0"; // or get from process.env.GITHUB_CLIENT_ID
// const GITHUB_CLIENT_SECRET = "620b1562c7c1cc57112fb3b54a2978df22f98e37"; // or get from process.env.GITHUB_CLIENT_SECRET
// const GITHUB_CALLBACK_URL = "http://localhost:4000/auth/github/callback"; // or get from process.env.GITHUB_CALLBACK_URL

app.use(cors());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`${configs.FRONTEND_URL}/login`);
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

=======
const bodyParser = require('body-parser')
const User = require("./db/models/User.js");
const Account = require("./db/models/Account.js");
const Login = require("./db/models/Login.js");
const userRouter = require("./routes/userRouter");

const GITHUB_CLIENT_ID = "fda597fe607c7161f2a0"; // or get from process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = "620b1562c7c1cc57112fb3b54a2978df22f98e37"; // or get from process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACK_URL = "http://localhost:4000/auth/github/callback"; // or get from process.env.GITHUB_CALLBACK_URL
app.use(cors());

app.use(bodyParser.json())

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("http://localhost:3000/login");
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

>>>>>>> d42322a40745eb4ffa44cd011cddd4d7e1be8ac3
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
<<<<<<< HEAD
      clientID: configs.GITHUB_CLIENT_ID,
      clientSecret: configs.GITHUB_CLIENT_SECRET,
      callbackURL: configs.GITHUB_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("profile");
      console.log(profile);
      // asynchronous verification, for effect...

      utilFunctions.checkUserOrSave(profile, done);
=======
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...

      let userInfo = profile._json;
      let userName = userInfo.login;
      console.log("checkAndSave the user");
      Login.findOne({ Username: userName }).then((loginUser) => {
        if (loginUser === null || loginUser === undefined) {
          // save the new user's data
          // console.log("create new date");
          let _loginUser = { Username: userName };
          Login.create(_loginUser).then((_login) => {
            console.log("user create Success!");
            //   console.log(_login);
            let account = { Picture: userInfo.avatar_url };
            Account.create(account).then((_account) => {
              // console.log(_account);
              let user = { Login: _login._id, Account: _account._id };
              User.create(user).then((_user) => {
                console.log("created user");
                console.log(_user);
                // return _user;
                return done(null, _user);
              });
            });
          });
        } else {
          return done(null, loginUser);
        }
        // set the session
      });
>>>>>>> d42322a40745eb4ffa44cd011cddd4d7e1be8ac3
    }
  )
);
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

<<<<<<< HEAD
app.get("/", (req, res) => {
  res.send("<a href='/secret'>Access Secret Area</a>");
});

=======

//shimin code
>>>>>>> d42322a40745eb4ffa44cd011cddd4d7e1be8ac3
app.get("/login", (req, res) => {
  //   res.send("<a href='/auth/github'>Sign in With GitHub</a>");
  //   res.redirect("http://localhost:3000/login");
  res.redirect("/auth/github");
});

<<<<<<< HEAD
app.get("/secret", ensureAuthenticated, (req, res) => {
  res.send(`<h2>yo ${req.user}</h2>`);
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }), /// Note the scope here
  function (req, res) {}
);

=======
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["read:user"] }), /// Note the scope here
  function (req, res) {}
);

//app.get("/secret", ensureAuthenticated, (req, res) => {
 // res.send(`<h2>yo ${req.user}</h2>`);
//});

>>>>>>> d42322a40745eb4ffa44cd011cddd4d7e1be8ac3
app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/logout",
    // successRedirect: "http://localhost:3000/user/",
  }),
  function (req, res) {
<<<<<<< HEAD
    res.redirect(`${configs.FRONTEND_URL}/user/${req.user.Username}`);
  }
);

// app.get(
//   "/auth/github/callback",
//   passport.authenticate("github", {
//     failureRedirect: "/logout",
//     successRedirect: "/user",
//   })
// );

app.get("/user", function (req, res) {
  console.log("callback");
  console.log(res);
  res.redirect(`${configs.FRONTEND_URL}/user`);
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect(`${configs.FRONTEND_URL}`);
});

app.use(userRouter);

const port = process.env.PORT || configs.PORT;
app.listen(port, () => console.log(`listening on port ${port}`));
=======
    res.redirect(`http://localhost:3000/user/${req.user.Username}`);
  }
);

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

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("http://localhost:3000/");
});


app.use(userRouter);
app.set('port', process.env.PORT || 8080)
app.listen(app.get('port'), () => console.log(`PORT: ${app.get('port')}`))
>>>>>>> d42322a40745eb4ffa44cd011cddd4d7e1be8ac3
