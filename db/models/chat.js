const mongoose = require('../connection.js');
const Schema = mongoose.Schema;

const Chat = new Schema({
    Sender: {type: Schema.Types.ObjectId, ref: 'User'},
    Content: String,
    TimeStamp: Date
})

module.exports = mongoose.model('Chat', Chat)