const mongoose = require('.././connection.js');
const Schema = mongoose.Schema;

const MessageHistory = new Schema({
    Participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
    Chats: [{type: Schema.Types.ObjectId, ref: 'Chat'}]
})

module.exports = mongoose.model('MessageHistory', MessageHistory)