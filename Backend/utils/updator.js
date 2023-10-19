const User = require('../models/User');
async function updateUserByEmail(email, newData) {
    let report = {
        error:false
    }
    try {
      const result = await User.updateOne({ email }, { $set: newData });
      if (result.modifiedCount === 1) {
        report.message =  'User updated successfully';
        return report;
      } else if (result.matchedCount === 0) {
        throw new Error(`User with email ${email} not found.`);
      } else {
        throw new Error('Unexpected update result.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      report.error = error;
      return report;
    }
  }

  
module.exports = {
    updateUserByEmail,
}