const mongoose = require('./connection.js')
const User = require('./models/User.js')
const Login = require('./models/Login.js')
const Account = require('./models/Account.js')


const testusers = ["galen", 'daniel', 'shimin'];
const logins = [
    {Token: 'galengit'}, {Token: 'danielgit'}, {Token:'shimingit'}];

// should delete all users in database and for each test user
// create and populate a user 
// must also create the reference objects in separate collections of the db
// so that population is possible

User.deleteMany({}).then(() =>{
    //necessary user elements: account
    //left to routes: all populating, Array 
    //
    for (let i = 0; i < testusers; i++){
        let login = new Login({
            Username: testusers[i], 
            Token: logins[i]
        })
        let account = new Account({

        })
        let user = {
            Login : login._id,
            Account : account._id
        }
        User.create(user).then(responseData=>{
            console.log(responseData);
            process.exit()
        })
    }   
}).catch(err => {console.log(err);process.exit()})
