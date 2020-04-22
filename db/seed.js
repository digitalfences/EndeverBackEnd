const mongoose = require('./connection.js')
const User = require('./models/User.js')
const Login = require('./models/Login.js')
const Account = require('./models/Account.js')


const testusers = ["galen", 'daniel', 'shimin'];
const logins = ['galengit', 'danielgit', 'shimingit'];

// should delete all users in database and for each test user
// create and populate a user 
// must also create the reference objects in separate collections of the db
// so that population is possible
console.log('running');
Account.deleteMany({}).then(() => Login.deleteMany({})).then(() => {
    User.deleteMany({})
    .then(() => {
        //necessary user elements: account
        //left to routes: all populating, Array 
        //
        console.log("beginning loop")
        for (let i = 0; i < testusers.length; i++) {
            console.log(`run ${i}`)
            let login = new Login({
                Username: testusers[i],
                Token: logins[i]
            })
            let account = new Account({
                Picture: '',
                Bio: '',
                Repositories: ['']
            })
            let user = {
                UserName: testusers[i],
                Login: login._id,
                Account: account._id
            }
            User.create(user).then(responseData => {
                console.log(responseData);
            })
            Account.create(account);
            Login.create(login);
        }
    })
})
