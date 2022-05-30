const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const EmailOtpVerification = require('../models/EmailOtpVerification');
const bcrypt = require("bcryptjs");
const CLIENT_ID = '889693167677-s4i8lnoe151j11thpc6ioq728lutcsag.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//048q718VqicKoCgYIARAAGAQSNwF-L9IrVN_BaPMOnfDMdltb3DfZ--1z8eNoLbDLxX63JUAP89uXxURVFx-11ObsAxAiH5D9y6M'
const responder = require('../utils/responder');

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const sendOtpVerificationEmail = async (_id, email, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'rajasingh8889@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
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

        const result = await transport.sendMail(mailOptions)
        responder.success(res, "OTP send Successfully", 201)
    } catch (error) {
        console.log(error)
    }
}

module.exports = sendOtpVerificationEmail;