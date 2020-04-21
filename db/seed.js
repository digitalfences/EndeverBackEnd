const db = require('./models')

const testusers = ["galen", 'daniel', 'shimin']

const accounts;
const logins = [
    {Token: 'galengit'}, {Token: 'danielgit'}, {Token:'shimingit'}];

// should delete all users in database and for each test user
// create and populate a user 
// must also create the reference objects in separate collections of the db
// so that population is possible

db.User.deleteMany({}).then(() =>{
    //necessary user elements: account
    //left to routes: all populating, Array 
    //
    for (let i = 0; i < testusers; i++){
        let login = new db.Login({
            Username: testusers[i], 
            Token: logins[i]
        })
        let account = new db.Account({

        })
        let user = {
            Login : login._id,
            Account : account._id
        }
        db.User.create(user).then(responseData=>{
            console.log(responseData);
            process.exit()
        })
    }   
})
