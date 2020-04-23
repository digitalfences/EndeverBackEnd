const Login = require("../models/Login");
const Account = require("../models/Account");
const User = require("../models/User");
module.exports = {
  checkAndSave: (userInfo) => {
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
              return _user;
            });
          });
        });
      } else {
        console.log("already");
        console.log(loginUser);
        return loginUser;
      }
      // set the session
    });
  },

  getAccountByUserName: (req, res) => {
    // console.log(userName);

    // console.log(req.params);
    // console.log(req.query);
    let _userName = req.params.userName;
    if (_userName === undefined || _userName === "") {
      res.send(_userName + " is empty");
    } else {
      Login.findOne({ Username: _userName }).then((loginUser) => {
        // console.log(_userName);
        // console.log(loginUser);
        if (loginUser === null || loginUser === undefined) {
          res.send("Can't found login whit name is " + _userName);
        } else {
          User.findOne({ Login: `${loginUser._id}` }).then((_user) => {
            // console.log(loginUser._id);
            if (_user === null && _user === undefined) {
              res.send("Can't found user whit name is " + _userName);
            } else {
              Account.findOne({ _id: `${_user.Account}` }).then((_account) => {
                if (_user === null && _user === undefined) {
                  res.send("Can't found account whit name is " + _userName);
                } else {
                  // console.log("return");
                  console.log(_account);
                  // ctx.response.account = _account;
                  // console.log(account);
                  console.log("before return ");
                  // return _account;
                  res.json(_account);
                }
              });
            }
          });
        }
      });
    }
  },
};
