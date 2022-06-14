const router = require('express').Router();
const { ids } = require('googleapis/build/src/apis/ids');
const authController = require('../controllers/auth');
const responder = require('../utils/responder');
const EmailOtpVerification = require('../models/EmailOtpVerification');
const bcrypt = require('bcryptjs/dist/bcrypt');
const Student = require('../models/Student');
const sendOtpVerificationEmail = require('../utils/sendOtpVerificationEmail')
const authJwtMiddleware = require('../middlewares/authJwt.js');
const roleMiddleware = require('../middlewares/role')

router.post("/logout", authJwtMiddleware.authenticateJWT, authController.logout);
router.post("/login", authController.login);
router.get("/isLogin", authJwtMiddleware.authenticateJWT, authController.isLogin);
// router.post("/refreshToken", authController.refreshToken)

router.post('/register', authController.registerStudent);
router.post('/register/faculty', authJwtMiddleware.authenticateJWT, roleMiddleware.isAdmin, authController.registerFaculty)

router.post('/verifyOtp', async (req, res) => {
    try {
        let { userId, otp } = req.body;
        // console.log("otp", userId)
        if (!userId || !otp) {
            return responder.error(res, "Invalid OTP", 401);
        }

        const UserVerificationRecord = await EmailOtpVerification.find({ userId, })
        // console.log(UserVerificationRecord)
        if (UserVerificationRecord.length <= 0) {
            return responder.error(res, "Account does not exists", 404);
        }

        const { expiresAt } = UserVerificationRecord[0];
        const encryptedOtp = UserVerificationRecord[0].otp;

        if (expiresAt < Date.now()) {
            await UserVerificationRecord.deleteMany({ userId });
            return responder.error(res, "code has expired", 403);
        }

        const validOtp = await bcrypt.compare(otp, encryptedOtp);

        if (!validOtp) {
            return responder.error(res, "Invalid OTP Entered", 403);
        }

        await Student.updateOne({ _id: userId }, { email_verified: true });
        await EmailOtpVerification.deleteMany({ userId })
        return responder.success(res, { message: "User Email verified successfully" }, 201);

    } catch (error) {
        responder.error(res, error.message, 400);
    }
})

router.post("/resendOtpVerificationCode", async (req, res) => {
    try {
        let { userId, email } = req.body;

        if (!userId || !email) {
            return responder.error(res, "Invalid User", 401);
        }
        // console.log("userId", userId)
        await EmailOtpVerification.deleteMany({ userId });

        sendOtpVerificationEmail(userId, email, res)

    } catch (error) {
        responder.error(res, error.message, 400);
    }
})


module.exports = router;