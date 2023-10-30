const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  
  cohort:{
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Cohort'
  },
  color:{
    type: Number,
    required:true
  },
  
  startTime:{
    type: Date,
    required: true
  },
  endTime:{
    type: Date,
    required: true
  },
  duration:{
    type: Number,
    required: true
  },

  title: {
    type: String,
    required: true 
  },
  description:{
    type: String,
    required: true
  },
  published: {
    type: Boolean,
    required: true
  },

  graded:{
    type: Boolean,
    required: true
  },
  
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }
  ],

  studentAnswers:[
    {
      student:{
        type: String,
        required: true
      },
      answer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentAnswer'
      },
      score:{
        type: Number,
        required: true
      }
    }
  ],

  disputes:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dispute'
    }
  ],

  allActivityTimeline:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ActivityTimeline'
    }
  ]
});

module.exports = mongoose.model('Exam', examSchema);
