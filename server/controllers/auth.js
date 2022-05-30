const responder = require('../utils/responder');
const { createStudentValidation } = require('../validators/student');
const Student = require('../models/Student');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOtpVerificationEmail = require('../utils/sendOtpVerificationEmail')
// const nodemailer = require('nodemailer')
// const { google } = require('googleapis')
// const EmailOtpVerification = require('../models/EmailOtpVerification');

// const CLIENT_ID = '889693167677-s4i8lnoe151j11thpc6ioq728lutcsag.apps.googleusercontent.com'
// const CLIENT_SECRET = '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'
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
// const REFRESH_TOKEN = '1//048q718VqicKoCgYIARAAGAQSNwF-L9IrVN_BaPMOnfDMdltb3DfZ--1z8eNoLbDLxX63JUAP89uXxURVFx-11ObsAxAiH5D9y6M'

// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

// async function sendMail() {
//     try {
//         const accessToken = await oAuth2Client.getAccessToken()

//         const transport = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 type: 'OAuth2',
//                 user: 'rajasingh8889@gmail.com',
//                 clientId: CLIENT_ID,
//                 clientSecret: CLIENT_SECRET,
//                 refreshToken: REFRESH_TOKEN,
//                 accessToken: accessToken
//             }
//         })

//         const mailOptions = {
//             from: 'Raja Singh <rajasingh8889@gmail.com>',
//             to: 'rajaa.19.becs@acharya.ac.in',
//             subject: 'Hello From EVENTS',
//             text: 'hello from Events',
//             html: '<h1>hello from events</h1>'
//         }

//         const result = await transport.sendMail(mailOptions)
//         console.log(result)
//     } catch (error) {
//         console.log(error)
//     }
// }



const controller = {
    registerStudent: async (req, res) => {
        console.log(req.body);
        const { firstName, lastName, password, email, phone, branch } = req.body;
        const { error } = createStudentValidation(req.body);
        if (error) {
            return responder.error(res, error.details[0].message, 400);
        }
        try {
            const AlreadyExist = await Student.findOne({ email });
            if (AlreadyExist) {
                return responder.error(res, "Account already Exist", 409);
            }
            else {
                const encryptedPassword = await bcrypt.hash(password, 10);
                const student = new Student({ ...req.body, email, firstName, lastName, phone, branch, password: encryptedPassword });
                // const token = jwt.sign({ user_id: student._id, email: student._email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
                // student.token = token;
                await student.save();
                console.log(student)

                sendOtpVerificationEmail(student._id, student.email, res)
                return responder.success(res, { message: "Account Created Successfully!", student }, 201);
            }


        } catch (error) {
            return responder.error(res, error.message, 400);
        }


    },
    login: async (req, res) => {

    }
}

// const sendOtpVerificationEmail = async (_id, email, res) => {
//     try {
//         const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

//         const accessToken = await oAuth2Client.getAccessToken()

//         const transport = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 type: 'OAuth2',
//                 user: 'rajasingh8889@gmail.com',
//                 clientId: CLIENT_ID,
//                 clientSecret: CLIENT_SECRET,
//                 refreshToken: REFRESH_TOKEN,
//                 accessToken: accessToken
//             }
//         })

//         const mailOptions = {
//             from: 'Raja Singh <rajasingh8889@gmail.com>',
//             to: email,
//             subject: 'Verify Your Email',
//             text: 'hello from Events',
//             html: `<p>Enter <b>${otp}</b> in the app to verify email address and complete verification </p><p>This Code <b>expires in 1 hour</b>.</p>`
//         }

//         const encryptedOtp = await bcrypt.hash(otp, 10);

//         const newOtpVerification = await new EmailOtpVerification({
//             userId: _id,
//             otp: encryptedOtp,
//             createdAt: Date.now(),
//             expiresAt: Date.now() + 3600000,
//         })

//         await newOtpVerification.save();

//         const result = await transport.sendMail(mailOptions)
//         console.log(result)

//     } catch (error) {
//         console.log(error)
//     }
// }


module.exports = controller;