const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        default: 'Admin'
    }
})

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;