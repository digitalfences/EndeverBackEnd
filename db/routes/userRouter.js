const express = require("express");
const router = express.Router();
const LoginController = require("../controllers/LoginController");

router.get("/account/:userName", LoginController.getAccountByUserName);

module.exports = router;
