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
const utilFunctions = require("./utilFunctions");

const GITHUB_CLIENT_ID = "fda597fe607c7161f2a0"; // or get from process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = "620b1562c7c1cc57112fb3b54a2978df22f98e37"; // or get from process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACK_URL = "http://localhost:4000/auth/github/callback"; // or get from process.env.GITHUB_CALLBACK_URL

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
      console.log("profile");
      console.log(profile);
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
  res.redirect(`http://localhost:3000/user`);
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("http://localhost:3000/login");
});

app.use(userRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`listening on port ${port}`));
