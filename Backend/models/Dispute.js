const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
    student: {
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
    resolved:{
        type: Boolean,
        required: true
    },
    studentComment:{
        type: String
    },
    facultyComment:{
        type: String
    }
});

module.exports = mongoose.model('Dispute', disputeSchema);
