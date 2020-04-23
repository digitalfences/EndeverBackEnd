// Fill in your client ID and client secret that you obtained
// while registering the application
const clientID = "fda597fe607c7161f2a0";
const clientSecret = "620b1562c7c1cc57112fb3b54a2978df22f98e37";

const Koa = require("koa");
const path = require("path");
const serve = require("koa-static");
const route = require("koa-route");
const axios = require("axios");
const LoginController = require("./db/controllers/LoginController");

const app = new Koa();

// const main = serve(path.join(__dirname + "/"));

const oauth = async (ctx) => {
  const requestToken = ctx.request.query.code;
  console.log("authorization code:", requestToken);

  const tokenResponse = await axios({
    method: "post",
    url:
      "https://github.com/login/oauth/access_token?" +
      `client_id=${clientID}&` +
      `client_secret=${clientSecret}&` +
      `code=${requestToken}`,
    headers: {
      accept: "application/json",
    },
  });

  const accessToken = tokenResponse.data.access_token;
  console.log(`access token: ${accessToken}`);

  const result = await axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      accept: "application/json",
      Authorization: `token ${accessToken}`,
    },
  });
  console.log(result.data);
  LoginController.checkAndSave(result.data);
  //   const name = result.data.name;
  //   console.log(ctx);
  // ctx.response.json(result.data);

  ctx.response.redirect(`http://http://localhost:3000/user`);
};

// app.use(main);
app.use(route.get("/oauth/callback", oauth));

app.listen(4000);
