const mongoose = require('.././connection.js');
const Schema = mongoose.Schema;

const Login = new Schema({
    UserID: {type: Schema.Types.ObjectId, ref: 'User'},
    Token: String,
    Username: String,
    Admin: Boolean
})

module.exports = mongoose.model('Login', Login)