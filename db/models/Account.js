const mongoose = require("../connection.js");
const Schema = mongoose.Schema;

const Account = new Schema({
  RealName: String,
  Picture: String,
  Bio: String,
  Repositories: [String],
  LikedUsers: [{type: Schema.Types.ObjectId, ref:"User"}],
  MatchedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  Feed: [{ type: Schema.Types.ObjectId, ref: "User" }],
  Messages: [{ type: Schema.Types.ObjectId, ref: "MessageHistory" }],
});

module.exports = mongoose.model("Account", Account);
