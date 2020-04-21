const User = require('./models/User')

const testusers = ["galen", 'daniel', 'shimin']

const accounts;
const logins;
// should delete all users in database and for each test user
// create and populate a user 
// must also create the reference objects in separate collections of the db
// so that population is possible
User.deleteMany({}).then(() =>{
  User.create(testUserData).then(responseData=>{
    console.log(responseData)
    process.exit();
  }).catch(err =>{
    console.log(err)
  })
})
