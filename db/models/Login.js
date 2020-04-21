const mongoose = require('../db/connection.js');
const Schema = mongoose.Schema;

const Login = new Schema({
    UserID: {type: Schema.Types.ObjectId, ref: 'User'},
    Token: String,
    Username: String,
    Password: String,
    Admin: Boolean
})

module.exports = mongoose.model('Login', Login)