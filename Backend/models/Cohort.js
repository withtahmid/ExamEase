const mongoose = require('mongoose');

const CohortSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true 
  },
  color:{
    type: Number,
    required:true
  },
  description:{
    type:String,
    required: true
  },
  exams:[
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Exam' 
    }
  ],
  faculty:{
    type:String,
    required: true
  },
  
  students: [
    {
        type:String
    }
  ]
});

module.exports = mongoose.model('Cohort', CohortSchema);
