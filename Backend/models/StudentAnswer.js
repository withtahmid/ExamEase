const mongoose = require('mongoose');

const StudentAnswer = new mongoose.Schema({
    student:{
        type: String,
        required: true
    },
    startTime:{
        type: Date,
        required: true
    },
    exam:{
        type:mongoose.Schema.Types.ObjectId,
        required: true
    },

    allAnswer:[{
            question: {
                type:mongoose.Schema.Types.ObjectId,
                required: true
            },
            textAnswer: String,
            audioAnswer: String,
            mcqAnswer: String
        }
    ],
    submitted:{
        type:Boolean,
        required: true
    }
});

module.exports = mongoose.model('StudentAnswer', StudentAnswer);
