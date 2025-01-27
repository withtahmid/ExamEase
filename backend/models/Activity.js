const mongoose = require('mongoose');

const actvitySchema = new mongoose.Schema({
    time: {
        type :Date,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image: String
});

module.exports = mongoose.model('Activity', actvitySchema);
