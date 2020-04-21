const mongoose = require('../db/connection.js');
const Schema = mongoose.Schema;

const Login = new Schema({
    Token: String,
    Username: String,
    Password: String
})

module.exports = mongoose.model('Login', Login)