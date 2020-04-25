const mongoose = require('mongoose');
let mongooseURI = '';
if (process.env.NODE_ENV === "production"){
    console.log(process.env.DB_URL);
    mongooseURI = process.env.DB_URL;
} else {
    mongooseURI = "mongodb://localhost/endever";
}


//test

mongoose.connect(mongooseURI, {useNewUrlParser: true});
module.exports = mongoose;