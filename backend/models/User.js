const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true 
  },
  email: {
    type: String, 
    required: true, 
    unique: true 
  },
  dp:{
    type:String
  },
  password:{
    type: String, 
    required: true, 
  },
  role: {
    type: String, 
    required: true
  },
  active:{
    type:Boolean, 
    reqired:true
  },
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Notification' 
    }
  ],
  cohorts:[
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Cohort' 
    }
  ],
  disputes:[
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Dispute' 
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
