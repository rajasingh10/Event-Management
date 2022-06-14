const mongoose = require('mongoose');


const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    rules: {
        type: [String],
        default: [],
    },
    venue: {
        type: String,
        default: 'TBD'
    },
    image: {
        type: String,
    },
    prize: {
        type: String,
    },
    fees: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: true,
    }
});

const Event = mongoose.model('Event', EventSchema);


module.exports = Event;