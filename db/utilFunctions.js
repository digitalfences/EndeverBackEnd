const fetch = require("node-fetch");
const Login = require("./models/Login");
const Account = require("./models/Account");
const User = require("./models/User");

//https://stackoverflow.com/questions/3718282/javascript-shuffling-objects-inside-an-object-randomize
function shuffle(sourceArray) {
  for (let i = 0; i < sourceArray.length - 1; i++) {
    let j = i + Math.floor(Math.random() * (sourceArray.length - i));
    let temp = sourceArray[j];
    sourceArray[j] = sourceArray[i];
    sourceArray[i] = temp;
  }
  return sourceArray;
}
function checkUserOrSave(profile, done) {
  let userInfo = profile._json;
  let userName = userInfo.login;
  let reposUrl = "https://api.github.com/users/" + userName + "/repos";
  let repos = [];
  fetch(reposUrl)
    .then((res) => res.json())
    .then((res) => {
      let repoList = [];
      res.map((item) => {
        let repoUrl = item.name;
        if (repoUrl !== undefined && repoUrl !== "") {
          repoList.push(repoUrl);
        }
      });
      User.findOne({ UserName: userName }).then((loginUser) => {
        if (loginUser === null || loginUser === undefined) {
          let _loginUser = {
            Username: userName,
          };
          Login.create(_loginUser).then((_login) => {
            console.log("user create Success!");
            console.log("repos");
            console.log(repoList);
            let feeds = [];
            User.find({}).then((users) => {
              if (users !== undefined) {
                for (_user in users) {
                  feeds.push(_user._id);
                }
              }
            });
            let account = {
              RealName: name,
              Picture: userInfo.avatar_url,
              Bio: userInfo.bio,
              Repositories: repoList,
              Feed: feeds,
            };

            Account.create(account).then((_account) => {
              let user = {
                UserName: _login.Username,
                Login: _login._id,
                Account: _account._id,
              };
              User.create(user).then((_user) => {
                return done(null, _user);
              });
            });
          });
        } else {
          return done(null, loginUser);
        }
        // end of then
      });
    });
}
module.exports = { checkUserOrSave, shuffle };
