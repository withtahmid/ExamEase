const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({

    exam: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Exam'
    },
    
    cohort:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cohort'
    },

    type:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    score:{
        type: Number,
        required: true
    },

    // optional for written
    description: String,
    
    textAnswer: String, 
   
    // optional for mcq
    mcqOptions:[{type: String}],
    mcqAnswer:String,
   
    // optional for viva
    audioQuestion: String,
    audioAnswer:String
});

module.exports = mongoose.model('Question', questionSchema);
