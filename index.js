const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const GitHubStrategy = require("passport-github2").Strategy;
const userRouter = require("./db/routes/userRouter");
const utilFunctions = require("./db/utilFunctions");
const configs = require("./db/configs.js");
const bodyParser = require("body-parser");
const User = require("./db/models/User.js");
const Account = require("./db/models/Account.js");
const Login = require("./db/models/Login.js");

app.use(cors());
app.use(bodyParser.json());

app.set("port", process.env.PORT || configs.PORT);
app.use(userRouter);
app.listen(app.get("port"), () => {
  console.log(` PORT: ${app.get("port")} `);
});

function ensureAuthenticated(req, res, next) {
  //console.log("ik",req.user);

  res.json({});
  if (req.isAuthenticated()) {
    return next();
  }
  //res.redirect(`${configs.FRONTEND_URL}`);
}

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "POST,GET,PATCH,PUT,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Origin",
    // `${configs.FRONTEND_URL}`
    "*"
    // "https://tigerkingfront.netlify.app"
    // "*"
  );
  next();
});

passport.use(
  new GitHubStrategy(
    {
      clientID: configs.GITHUB_CLIENT_ID,
      clientSecret: configs.GITHUB_CLIENT_SECRET,
      callbackURL: configs.GITHUB_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      //console.log("profile");
      //console.log(profile);
      // asynchronous verification, for effect...

      utilFunctions.checkUserOrSave(profile, done);
    }
  )
);
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("<a href='/secret'>Access Secret Area</a>");
});

//shimin code

app.get("/login", (req, res) => {
  //   res.send("<a href='/auth/github'>Sign in With GitHub</a>");
  //   res.redirect("http://localhost:3000/login");
  res.redirect("/auth/github");
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["read:user"] }), /// Note the scope here
  function (req, res) {}
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/logout",
    // successRedirect: "http://localhost:3000/user/",
  }),
  function (req, res) {
    console.log(req);
    res.redirect(`${configs.FRONTEND_URL}/user`);
  }
);

app.get("/sessioncheck", (req, res) => {
  // if (
  //   ("passportauth", passport.authenticate("github", { scope: ["read:user"] }))
  // ) {
  //   console.log(req);
  //   res.json(req.user);
  // } else {
  //   console.log(req);
  //   res.json({ auth: false });
  // }
  // let user = req.user;
  // // let user = req._passport.session.user;
  // if (user !== undefined) {
  //   console.log(req);
  //   res.json(req.user);
  // } else {
  //   console.log(req);
  //   res.json({ auth: false });
  // }
  console.log("check session");
  // console.log(req);
  console.log(req.user);
  // console.log(req.sessionID);
  // console.log(req.session.passport);
  // console.log(req.session.views);
  // console.log(req.session.cookie);
  // console.log(req._passport.session.user);
  if (req.user !== undefined) {
    // console.log(req);
    res.json(req.user);
  } else {
    // console.log(req);
    res.json({ auth: false });
  }
});
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

app.get("/users", (req, res) => {
  User.find()
    .populate("Login")
    .populate("Account")
    .then((user) => res.json(user));
});
app.get("/account/name/:userName", (req, res) => {
  User.find({ UserName: req.params.userName })
    .populate("Login")
    .populate("Account")
    .then((user) => res.json(user));
});
app.get("/account/id/:id", (req, res) => {
  User.find({ _id: req.params.id })
    .populate("Login")
    .populate("Account")
    .then((user) => res.json(user));
});
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
app.post("/", (req, res) => {
  let login = new Login({
    Username: req.body.Login.Username,
    Token: req.body.Login.Token,
  });
  let repoArray = [];
  repoArray.push(...req.body.Account.Repositories);
  let account = new Account({
    Picture: req.body.Account.Picture,
    Bio: req.body.Account.Bio,
    Repositories: repoArray,
  });
  let user = {
    Login: login._id,
    Account: account._id,
  };
  User.create(user).then((responseData) => {
    console.log(responseData);
  });
  Login.create(login);
  Account.create(account);
});
app.put("/users/:id", (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, req.body).then((user) => {
    res.json(user);
  });
});

app.delete("/users/:id", (req, res) => {
  User.findOneByDelete({ _id: req.params.id }).then((user) => res.json(user));
});

app.get("/message/:id", (req, res) => {
  Account.findOne({ Messages: req.params.id })
    .populate("Messages")
    .then((messages) => {
      res.json(messages);
    });
});
