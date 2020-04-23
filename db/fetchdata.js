const fs = require("fs");
const fetch = require("node-fetch");
const sourceUrl = "https://api.github.com/users/";
const jsonDataFilePath = "./db/sources.json";

const user = ["life2free", "Daniel-Edminster", "digitalfences", "Athly23"];

// fetch the source data from api
function getSourcesFromApi() {
  user.map((item) => {
    console.log(item);
    let url = sourceUrl + item;
    console.log(url);
    fetch(url)
      //   .then((res) => res.json())
      .then((res) => res.text())
      .then((res) => {
        console.log(res);
        // let sourceData = JSON.parse(res);
        // sourceData = JSON.stringify(sourceData);
        // write the source data to json file
        fs.appendFileSync(`${jsonDataFilePath}`, res, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("write source data to json file success");
          }
        });
      })
      .catch((err) => {
        console.log(
          "Got source data from api and wrote to json file failed!",
          err
        );
      });
  });
}

getSourcesFromApi();
