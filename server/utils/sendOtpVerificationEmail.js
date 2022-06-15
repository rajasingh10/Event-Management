const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const EmailOtpVerification = require('../models/EmailOtpVerification');
const bcrypt = require("bcryptjs");
// const CLIENT_ID = '215154276267-56cctg2pu53vjsfm3cik0h0nk5pqrl11.apps.googleusercontent.com'
// const CLIENT_SECRET = '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'
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
// const REFRESH_TOKEN = '1//04IEwgcIkvfZvCgYIARAAGAQSNwF-L9IrBMpSN3X_SI4FZpN3IFqWFCFZSxExXlA6SdoPsyBYVp9DUhJ2pmyTvXW77evWwBggiH0'
const responder = require('../utils/responder');


const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

const sendOtpVerificationEmail = async (_id, email, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'rajasingh8889@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'Raja Singh <rajasingh8889@gmail.com>',
            to: email,
            subject: 'Verify Your Email',
            text: 'hello from Events',
            html: `<p>Enter <b>${otp}</b> in the app to verify email address and complete verification </p><p>This Code <b>expires in 1 hour</b>.</p>`
        }

        const encryptedOtp = await bcrypt.hash(otp, 10);

        const newOtpVerification = await new EmailOtpVerification({
            userId: _id,
            otp: encryptedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        })

        await newOtpVerification.save();

        await transport.sendMail(mailOptions)
        // responder.success(res, "OTP send Successfully", 201)
    } catch (error) {
        responder.error(res, error.message, 400);
    }
}

module.exports = sendOtpVerificationEmail;