const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdOn: {
        type: Number,
        default: + new Date()
    },
    password: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        default: 'Faculty'
    }
});

const Faculty = mongoose.model('Faculty', FacultySchema);

module.exports = Faculty;