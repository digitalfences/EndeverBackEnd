const fs = require("fs");
const fetch = require("node-fetch");
const userGithubBaseUrl = "https://api.github.com/users/";
const usersJsonDataFilePath = "./db/users.json";
const reposJsonDataFilePath = "./db/repos.json";

// const user = ["life2free", "Daniel-Edminster", "digitalfences", "Athly23"];
const user = ["Daniel-Edminster", "digitalfences"];

// fetch the source data from api
function getUserInfoFromApi() {
  // user.map((item) => {
  //   console.log(item);
  for (let i = 0; i < user.length; i++) {
    let index = i;
    let item = user[index];
    let userInfoUrl = userGithubBaseUrl + item;

    fetch(userInfoUrl)
      //   .then((res) => res.json())
      .then((res) => {
        return res.text();
      })
      .then((res) => {
        console.log(res);
        if (index === 0) {
          res = "[" + res + ",";
        }
        if (index === user.length - 1) {
          res = res + "]";
        } else {
          res = res + ",";
        }
        console.log(res);
        fs.appendFileSync(`${usersJsonDataFilePath}`, res, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("write user data to json file success");
          }
        });
      })
      .catch((err) => {
        console.log(
          "Got source data from api and wrote to json file failed!",
          err
        );
      });
  }
}

getUserInfoFromApi();

function getRepoFromApi() {
  for (let i = 0; i < user.length; i++) {
    let item = user[i];
    console.log(item);
    let reposUrl = userGithubBaseUrl + item + "/repos";
    console.log(reposUrl);
    fetch(reposUrl)
      //   .then((res) => res.json())
      .then((res) => res.text())
      // .then((res) => res.text())
      .then((res) => {
        // console.log(res);
        // if (i === 1) {
        //   res = "[" + res + ",";
        // } else if (i === user.length - 1) {
        //   res = res + "]";
        // } else {
        //   res = res + ",";
        // }

        // res = JSON.stringify(res);
        console.log(res);
        res = res.replace("[", "");
        res = res.replace("]", "");
        if (i === 0) {
          res = "[" + res + ",";
        }
        if (i === user.length - 1) {
          res = res + "]";
        } else {
          res = res + ",";
        }
        fs.appendFileSync(`${reposJsonDataFilePath}`, res, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("write repos data to json file success");
          }
        });
      })
      .catch((err) => {
        console.log(
          "Got repos data from api and wrote to json file failed!",
          err
        );
      });
  }
}

// getRepoFromApi();
