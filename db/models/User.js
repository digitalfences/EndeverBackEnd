const mongoose = require('.././connection.js');
const Schema = mongoose.Schema;

const User = new Schema({
    UserName: String,
    Login: { type: Schema.Types.ObjectId, ref: 'Login'},
    Account: {type: Schema.Types.ObjectId, ref: 'Account'}
})

module.exports = mongoose.model('User', User)