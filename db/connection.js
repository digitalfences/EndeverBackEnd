const mongoose = require("mongoose");
let mongooseURI = "";
if (process.env.NODE_ENV === "production") {
  mongooseURI = process.env.DB_URL;
} else {
  mongooseURI = "mongodb://localhost/endever";
}

//test

mongoose.connect(mongooseURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
module.exports = mongoose;
