const mongoose = require('mongoose');
let mongooseURI = '';
// if (process.env.NODE_ENV === "production"){
//     console.log(process.env.DB_URL);
//     mongooseURI = process.env.DB_URL;
// } else {
//     console.log('development')
//     mongooseURI = "mongodb://localhost/endever";
// }
     mongooseURI = process.env.DB_URL + 'endever?retryWrites=true&w=majority';



//test

mongoose.connect(mongooseURI, {useNewUrlParser: true});
module.exports = mongoose;