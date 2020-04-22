const mongoose = require('mongoose');
let mongooseURI = '';
if (process.env.NODE_ENV === "production"){
    mongoURI = process.env.DB_URI;
} else {
    mongooseURI = "mongodb://localhost/endever";
}


//test

mongoose.connect(mongooseURI, {useNewUrlParser: true});
module.exports = mongoose;