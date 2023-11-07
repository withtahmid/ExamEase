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
    submitTime:{
        type: Date
    },
    exam:{
        type:mongoose.Schema.Types.ObjectId,
        required: true
    },

    allAnswer:[{
            question: {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Question',
                required: true
            },
            obtainedScore: Number,
            answer: String,
            audio: String
        }
    ],
    attended:{
        type:Boolean,
        required: true
    },
    submitted:{
        type:Boolean,
        required: true
    },
    totalScore: {
        type:Number
    }
});

module.exports = mongoose.model('StudentAnswer', StudentAnswer);
