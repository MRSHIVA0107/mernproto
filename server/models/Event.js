const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
    },
    type: {
        type: String,
        enum: ['Event', 'Birthday', 'Anniversary', 'Countdown'],
        default: 'Event'
    },
    isAllDay: {
        type: Boolean,
        default: false
    },
    repeat: {
        type: String,
        default: 'Never'
    },
    reminder: {
        type: String,
        default: 'On start'
    },
    alarm: {
        type: Boolean,
        default: false
    },
    guests: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', EventSchema);
