const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const GitHubStrategy = require("passport-github2").Strategy;
const Login = require("./models/Login");
const Account = require("./models/Account");
const User = require("./models/User");
const userRouter = require("./routes/userRouter");

const GITHUB_CLIENT_ID = "fda597fe607c7161f2a0"; // or get from process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = "620b1562c7c1cc57112fb3b54a2978df22f98e37"; // or get from process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACK_URL = "http://localhost:4000/auth/github/callback"; // or get from process.env.GITHUB_CALLBACK_URL
const LoginController = require("./controllers/LoginController");

app.use(cors());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("http://localhost:3000/login");
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      console.log({ accessToken, refreshToken, profile });
      console.log("profile8888888888888888888");
      console.log(profile);
      //   let user = LoginController.checkAndSave(profile._json);
      //   console.log("back");
      //   console.log(user);
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
          console.log("already");
          console.log(loginUser);
          return done(null, loginUser);
          //   return loginUser;
        }
        // set the session
      });
      // an example of how you might save a user
      //   new User({ username: profile.username }).fetch().then((user) => {
      //     if (!user) {
      //       user = User.forge({ username: profile.username });
      //     }

      //     user.save({ profile: profile, access_token: accessToken }).then(() => {
      //       return done(null, user);
      //     });
      //   });
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

app.get("/login", (req, res) => {
  //   res.send("<a href='/auth/github'>Sign in With GitHub</a>");
  //   res.redirect("http://localhost:3000/login");
  res.redirect("/auth/github");
});

app.get("/secret", ensureAuthenticated, (req, res) => {
  res.send(`<h2>yo ${req.user}</h2>`);
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }), /// Note the scope here
  function (req, res) {}
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/logout",
    // successRedirect: "http://localhost:3000/user/",
  }),
  function (req, res) {
    console.log("callback");
    console.log(res);

    console.log("request 8888888888888888888");
    console.log(req);
    console.log(req.user.Username);
    // console.log(req.session.passport.user);
    // req.session.user=
    res.redirect(`http://localhost:3000/user/${req.user.Username}`);
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
  res.redirect(`http://localhost:3000/user/life2free`);
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("http://localhost:3000/login");
});

app.use(userRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`listening on port ${port}`));
