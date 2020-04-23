const User = require("./models/User.js");
const Login = require("./models/Login.js");
const Account = require("./models/Account.js");
const usersJsonData = require("./users.json");
const reposJsonData = require("./repos.json");

let usersData = usersJsonData.map((item) => {
  let user = { Username: item.login, Picture: item.avatar_url, Bio: item.bio };
  let repos = [];
  for (let repo in reposJsonData) {
    console.log(repo);
  }
  return user;
});

// Source.deleteMany({}).then(() => {
//   Source.create(sourcesJsonData)
//     .then((sources) => {
//       console.log(sources);

//       News.deleteMany({}).then(() => {
//         newssJsonData.map((newsJsonData) => {
//           let newsSource = newsJsonData.source;
//           Source.findOne({ id: `${newsSource.id}` }).then((source) => {
//             newsJsonData.source._id = source._id;
//             News.create(newsJsonData)
//               .then((news) => {
//                 console.log(news);
//               })
//               .catch((err) => {
//                 console.log(err);
//               });
//           });
//         });
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
