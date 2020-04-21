const mongoose = require('mongoose');
let mongooseURI = 'mongodb://localhost/endever';

mongoose.connect(mongooseURI, {useNewUrlParser: true});
module.exports = mongoose;