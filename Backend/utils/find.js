const User = require('../models/User');

async function findUserByEmail(email){
    let account = {
        exists:false
    };
    try {
        const user = await User.findOne({ email });
    
        if (user) {
            account.exists = true;
            account.user = user;
          return account;
        }
        return account;

      } 
      catch (error) {
        console.error('Error fetching user:', error);
        throw error; 
      }
}

module.exports = {
    findUserByEmail
}