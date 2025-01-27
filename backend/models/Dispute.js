const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
    student: {
        type: String,
        required: true
    },
    subject:{
        type: String,
        require: true
    },
    studentComment:{
        type: String
    },
    facultyComment:{
        type: String
    },

    resolved:{
        type: Boolean,
        required: true
    },

    examTitle:{
        type: String,
        required: true
    },
    studentName:{
        type: String,
        required: true
    },

    cohortTitle:{
        type: String,
        required: true
    },

    exam:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    cohort:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cohort',
        required: true
    },

    studentPaper:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentAnswer',
        required: true
    },
    createdAt:{
        type: Date,
        required: true
    }

});

module.exports = mongoose.model('Dispute', disputeSchema);
