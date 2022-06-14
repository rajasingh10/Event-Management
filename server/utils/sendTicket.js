const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const bcrypt = require("bcryptjs");
const CLIENT_ID = '215154276267-56cctg2pu53vjsfm3cik0h0nk5pqrl11.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04IEwgcIkvfZvCgYIARAAGAQSNwF-L9IrBMpSN3X_SI4FZpN3IFqWFCFZSxExXlA6SdoPsyBYVp9DUhJ2pmyTvXW77evWwBggiH0'
const responder = require('../utils/responder');
const ticket = require('../templates/ticket');


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const sendTicket = async (name, eventName, code, email) => {
    try {
        // console.log(email);
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
            subject: 'Ticket for Event',
            text: "Do not reply",
            html: await ticket(name, eventName, code)
        }

        const result = transport.sendMail(mailOptions)
        // console.log(result);

    } catch (error) {
        responder.error(res, error.message, 400);
    }
}

module.exports = sendTicket;