const mongoose = require('mongoose');
let mongooseURI = '';
if (process.env.NODE_ENV === "production"){
    mongoURI = process.env.DB_URL;
} else {
    mongooseURI = "mongodb://localhost/endever";
}

mongoose.connect(mongooseURI, {useNewUrlParser: true});
module.exports = mongoose;