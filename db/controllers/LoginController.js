const Login = require("../models/Login");
const Account = require("../models/Account");
const User = require("../models/User");
module.exports = {
  getAccountByUserName: (req, res) => {
    let _userName = req.params.userName;
    if (_userName === undefined || _userName === "") {
      res.send(_userName + " is empty");
    } else {
      Login.findOne({ Username: _userName }).then((loginUser) => {
        if (loginUser === null || loginUser === undefined) {
          res.send("Can't found login whit name is " + _userName);
        } else {
          User.findOne({ Login: `${loginUser._id}` }).then((_user) => {
            if (_user === null && _user === undefined) {
              res.send("Can't found user whit name is " + _userName);
            } else {
              Account.findOne({ _id: `${_user.Account}` }).then((_account) => {
                if (_user === null && _user === undefined) {
                  res.send("Can't found account whit name is " + _userName);
                } else {
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
