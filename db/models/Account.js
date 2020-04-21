const mongoose = require('../db/connection.js');
const Schema = mongoose.Schema;

const Account = new Schema({
    Picture: String,
    Bio: String,
    Repositories: [String],
    MatchedUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    Feed: [{type: Schema.Types.ObjectId, ref: 'User'}],
    Messages: [{type: Schema.Types.ObjectId, ref: 'MessageHistory'}]
})

module.exports = mongoose.model('Account', Account)