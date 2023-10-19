const User = require('../models/User');

async function retriveUserByEmail(email){
    let result = {
        exists:false
    };
    try {
        const user = await User.findOne({ email });
    
        if (user) {
            result.exists = true;
            result.user = user;
          return result;
        }
        return result;
      } 
      catch (error) {
       result.error = 'Error fetching user:';
       return result; 
      }
}

module.exports = {
    retriveUserByEmail
}