const fetch = require("node-fetch");
const Login = require("./models/Login");
const Account = require("./models/Account");
const User = require("./models/User");

function checkAndSave(userInfo) {
  let userName = userInfo.login;
  Login.findOne({ Username: userName }).then((loginUser) => {
    if (loginUser === null || loginUser === undefined) {
      let _loginUser = { Username: userName };
      Login.create(_loginUser).then((_login) => {
        console.log("user create Success!");
        let account = { Picture: userInfo.avatar_url };
        Account.create(account).then((_account) => {
          let user = { Login: _login._id, Account: _account._id };
          User.create(user).then((_user) => {
            return _user;
          });
        });
      });
    } else {
      return loginUser;
    }
    // set the session
  });
}

function checkUserOrSave(profile, done) {
  let userInfo = profile._json;
  let userName = userInfo.login;
  Login.findOne({ Username: userName }).then((loginUser) => {
    if (loginUser === null || loginUser === undefined) {
      // save the new user's data
      let _loginUser = { Username: userName };
      Login.create(_loginUser).then((_login) => {
        console.log("user create Success!");
        let repos = getRepoFromApiByUserName(userName);
        console.log("repos");
        console.log(repos);
        let account = {
          Picture: userInfo.avatar_url,
          Bio: userInfo.bio,
          Repositories: repos,
        };
        Account.create(account).then((_account) => {
          let user = { Login: _login._id, Account: _account._id };
          User.create(user).then((_user) => {
            return done(null, _user);
          });
        });
      });
    } else {
      return done(null, loginUser);
    }
    // set the session
  });
}

function getRepoFromApiByUserName(userName) {
  let reposUrl = "https://api.github.com/users/" + userName + "/repos";
  console.log(reposUrl);
  fetch(reposUrl)
    //   .then((res) => res.json())
    .then((res) => res.json())
    .then((res) => {
      let repoList = [];
      res.map((item) => {
        let repoUrl = item.html_url;
        if (repoUrl !== undefined && repoUrl !== "") {
          repoList.push(repoUrl);
        }
      });
      console.log("return ");
      console.log(repoList);
      return repoList;
    })
    .catch((err) => {
      console.log(
        "Got source data from api and wrote to json file failed!",
        err
      );
      return [];
    });
}

module.exports = { checkAndSave, checkUserOrSave, getRepoFromApiByUserName };
