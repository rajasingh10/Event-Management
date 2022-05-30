const mongoose = require('mongoose');
const voucher_codes = require('voucher-code-generator');


const RegistrationSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    registeredOn: {
        type: Number,
        default: +new Date()
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed'],
        default: 'pending',
        required: true
    },
    registrationCode: {
        type: String,
        default: () => voucher_codes.generate({
            pattern: "###-###-###",
            prefix: "EV-",
        })[0],
        unique: true
    },
    confirmedBy: {
        type: String,
        default: null
    },
    confirmedOn: {
        type: Number,
        default: null
    },
    
})


const Registration = mongoose.model('Registration', RegistrationSchema);


module.exports = Registration;