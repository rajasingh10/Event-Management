const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    createdOn: {
        type: Number,
        default: + new Date()
    },
    branch: {
        type: String,
        required: true
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    role: {
        type: String,
        default: 'Student'
    }
})

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;