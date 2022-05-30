const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const EmailOtpVerificationSchema = new Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
});

const EmailOtpVerification = mongoose.model(
    "EmailOtpVerification",
    EmailOtpVerificationSchema
)

module.exports = EmailOtpVerification;