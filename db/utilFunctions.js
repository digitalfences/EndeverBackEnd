const fetch = require("node-fetch");
const Login = require("./models/Login");
const Account = require("./models/Account");
const User = require("./models/User");

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
    fetch(reposUrl).then(res => res.json()).then(res => {
        let repoList = [];
        res.map((item) => {
            let repoUrl = item.name;
            if (repoUrl !== undefined && repoUrl !== "") {
                repoList.push(repoUrl);
            }
        });
        User.findOne({ UserName: userName }).populate('Account').then((loginUser) => {
            if (loginUser === null || loginUser === undefined) {
                let _loginUser = {
                    Username: userName
                };
                Login.create(_loginUser).then((_login) => {
                    console.log("user create Success!");
                    console.log("repos");
                    console.log(repoList);

                    let account = {
                        RealName: userInfo.name,
                        WorkPlace: userInfo.company,
                        Picture: userInfo.avatar_url,
                        Bio: userInfo.bio,
                        Repositories: repoList,
                    };
                    Account.create(account).then((_account) => {
                        let user = {
                            UserName: _login.Username,
                            Login: _login._id,
                            Account: _account._id
                        };
                        User.create(user).then((_user) => {
                            console.log(_user);
                            return done(null, _user);
                        });
                    });
                })
            } else {console.log(loginUser)
                return done(null, loginUser);
            }
            // end of then
        });
    })
}
module.exports = { checkUserOrSave, shuffle };
