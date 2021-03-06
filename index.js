const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const GitHubStrategy = require("passport-github2").Strategy;
const userRouter = require("./db/routes/userRouter");
const utilFunctions = require("./db/utilFunctions");
const configs = require("./db/configs.js");
const bodyParser = require('body-parser')
const User = require("./db/models/User.js");
const Account = require("./db/models/Account.js");
const Login = require("./db/models/Login.js");

app.use(cors());
app.use(bodyParser.json())
app.set('port', process.env.PORT || configs.PORT)
app.use(userRouter)
app.listen(app.get('port'), () => {
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
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  //res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Origin", "https://agitated-panini-b410aa.netlify.app");
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
  function (req, res) { }
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/logout",
    // successRedirect: "http://localhost:3000/user/",
  }),
  function (req, res) {
    res.redirect(`${configs.FRONTEND_URL}/`);
  }
);

app.get("/sessioncheck", (req, res) => {

  if ("passportauth", passport.authenticate("github", { scope: ["read:user"] })) {
    res.json(req.user);
  }
  else {
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
  res.redirect(`${configs.FRONTEND_URL}/user`);
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect(`${configs.FRONTEND_URL}`);
});

app.put("/like/:likedUserId", (req, res) => {
  /* 
   Match Logic:
   req should have the id of the current login user, params the id of the profile that they like
   then it should check the like array of the person being liked to see if they like current user
   then if user is present, add them to each others match array and delete from likes
   else add the target to users liked array and return
   */
  if (req.isAuthenticated()) {
    let currentUserId = req.user._id;
    let likedUserAccountId = req.params.likedUserAccountId;
    Account.findOne({ _id: likedUserAccountId }).then(LikedAccount => {
      let LikesArray = LikedAccount.LikedUsers.slice();
      let MatchesArray = LikedAccount.MatchedUsers.slice();

      let idx = LikesArray.indexOf(currentUserId);
      if (idx !== -1) {
        MatchesArray.push(currentUserId)
        LikesArray = LikesArray.splice(idx, 1)
        Account.findOne({ _id: req.user.Account }.then(UserAccount => {
          UserMatches = UserAccount.MatchedUsers.slice();
          UserMatches.push(likedUserAccountId);
          Account.findOneAndUpdate({ _id: UserAccount._id }, { MatchedUsers: UserMatches })
          Account.findOneAndUpdate({ _id: likedUserAccountId }, { MatchedUsers: MatchesArray, LikedUsers: LikesArray })
        }))
      }
      else {
        Account.findOne({ _id: currentUserId }).then(UserAccount => {
          let UserLikes = UserAccount.LikedUsers.slice();
          UserLikes.push(likedUserAccountId);
          Account.findOneAndUpdate({ _id: UserAccount._id }, { LikedUsers: UserLikes })
        })
      }
    })
  } else {
    res.redirect(`${configs.FRONTEND_URL}`);
  }
});
{/*
app.put("/unlike/:unlikedUserId", (req, res) => {
  if (req.isAuthenticated()) {
    let currentUserId = req.user._id;
    let currentUserAccountId = req.user.Account;
    let unlikedUserId = req.params.unlikedUserId;
    Account.findOne({ _id: currentUserAccountId }).then(
      (currentUserAccount) => {
        User.find({ _id: unlikedUserId }).then((unlikedUser) => {
          Account.findOne({
            _id: unlikedUser.Account,
          })
            .then((unlikedUserAccount) => {
              let unlikedUserMatchedUsers = unlikedUserAccount.MatchedUsers;
              let _index = unlikedUserMatchedUsers.indexOf(currentUserId);
              if (_index !== -1) {
                let unlikedUserLikedUsers = unlikedUserAccount.LikedUsers;
                unlikedUserLikedUsers.push(currentUserId);
                unlikedUserMatchedUsers.splice(_index, 1);
                let currentUserMatchedUsers = currentUserAccount.MatchedUsers;
                _index = currentUserMatchedUsers.indexOf(unlikedUserId);
                currentUserMatchedUsers.splice(_index, 1);
              } else {
                let currentUserLikedUsers = currentUserAccount.LikedUsers;
                let _index = currentUserLikedUsers.indexOf(unlikedUserId);
                currentUserLikedUsers.splice(_index, 1);
              }
            })
            .then((res) => {
              res.json(req.user);
            });
        });
      }
    );
  } else {
    res.redirect(`${configs.FRONTEND_URL}`);
  }
});

*/}
app.get('/users', (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({ _id: req.user._id }).populate('Account').then(user => {
      User.find({ _id: { $ne: req.user._id } }).populate('Login').populate('Account').then(users => {
        let matched = [];
        let liked = [];

        matched = user.Account.MatchedUsers.slice();
        liked = user.Account.LikedUsers.slice();

        matched.push(...liked);

        let feed = users.filter(item => {
          let matchedItem = false;
          //item._id === ?
          //matched.forEach(item2 => item2._id)
          matched.forEach(item2 => {
            if (item2._id === item._id) {
              matchedItem = true;
            }
          })
          return !matchedItem;
          //item return
          //return true = goes in feed
          //return false = not go in feed
        })
        feed.sort(() => Math.random() - 0.5);
        res.json(feed)
        //res.json(users);
      })
    })
  }
  else {
    res.redirect(`${configs.FRONTEND_URL}`);
  }
})
app.get('/account/name/:userName', (req, res) => {
  if (req.isAuthenticated()) {
    User.find({ UserName: req.params.userName }).populate('Login').populate('Account').then(user => res.json(user))
  }
  else {
    res.redirect(`${configs.FRONTEND_URL}`);
  }
})
app.get('/matches/:id', (req,res) => {
  if(req.isAuthenticated()) {
    User.findOne({_id: req.params.id}.then(user=> {
      Account.findOne({_id: user.Account}).populate('MatchedUsers').populate('Messages').then(account => {
        res.json(account)
      })
    }))
  }
  else {
    res.redirect(`${configs.FRONTEND_URL}`);
  }
})

app.get('/account/id/:id', (req, res) => {
  if (req.isAuthenticated()) {
    User.find({ _id: req.params.id }).populate('Login').populate('Account').then(user => res.json(user))
  }
  else {
    res.redirect(`${configs.FRONTEND_URL}`);
  }
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
//app.post('/', (req,res) => { 
//})

app.put("/profile/:id", (req, res) => {
  /*
  we want to edit whatever fields are passed on the user object
  req.body = {
    RealName:String
    Bio: String
    Workplace: String
  }
  */
  if (req.isAuthenticated()) {
    User.find({ _id: req.params.id }).then(user => {
      if (user !== undefined) {
        Account.findOneAndUpdate({ _id: user.Account }, req.body).then(account => {
          res.json(account)
        })
      }
    })
  }
  else {
    res.redirect(`${configs.FRONTEND_URL}`);
  }
})

app.delete('/users/:id', (req, res) => {
  if (req.isAuthenticated()) {
    User.findOneAndDelete({ _id: req.params.id }).then(user => res.json(user))
  }
  else {
    res.redirect(`${configs.FRONTEND_URL}`);
  }
})
app.put('/like/:id', (req, res) => {
  if (req.isAuthenticated()) {
    /* 
    Match Logic:
    req should have the id of the current login user, and the id of the profile that they like
    then it should check the like array of the person being liked to see if they like current user
    then if user is present, add them to each others match array and delete from likes
    else add the target to users liked array and return
    */
    User.findOneByDelete({ _id: req.params.id }).then(user => res.json(user))
  }
  else {

  }
})

app.get("/message/:id", (req, res) => {
  if (req.isAuthenticated()) {
    Account.findOne({ Messages: req.params.id }).populate('Messages').then(messages => { res.json(messages) })
  }
  else {
    res.redirect(`${configs.FRONTEND_URL}`);
  }
})

