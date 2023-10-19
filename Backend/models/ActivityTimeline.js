const mongoose = require('mongoose');

const activityTimelineSchema = new mongoose.Schema({
    student:{
        type: String,
        required: true
    }

});

module.exports = mongoose.model('ActivityTimeline', activityTimelineSchema);
