const responder = require('../utils/responder');
const { createStudentValidation } = require('../validators/student');
const { createFacultyValidation } = require('../validators/faculty');

const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Faculty = require('../models/Faculty');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOtpVerificationEmail = require('../utils/sendOtpVerificationEmail')




const controller = {
    registerStudent: async (req, res) => {
        // console.log(req.body);
        const { firstName, lastName, password, email, phone, branch } = req.body;
        const { error } = createStudentValidation(req.body);
        if (error) {
            return responder.error(res, error.details[0].message, 400);
        }
        try {
            const AlreadyExist = await Student.findOne({ email });

            if (AlreadyExist) {
                if (!AlreadyExist.email_verified) {
                    return responder.error(res, "Email is not Verified, Try Login to Verify", 409);
                }
                return responder.error(res, "Account already Exist", 409);
            }
            else {
                const encryptedPassword = await bcrypt.hash(password, 10);
                const student = new Student({ ...req.body, email, firstName, lastName, phone, branch, password: encryptedPassword });
                // const token = jwt.sign({ user_id: student._id, email: student._email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
                // student.token = token;
                await student.save();
                // console.log(student)

                sendOtpVerificationEmail(student._id, student.email, res)
                return responder.success(res, { message: "Account Created Successfully!", student }, 201);
            }


        } catch (error) {
            return responder.error(res, error.message, 400);
        }
    },
    registerFaculty: async (req, res) => {
        // console.log(req.body);
        const { firstName, lastName, password, email, branch } = req.body;
        const { error } = createFacultyValidation(req.body);
        if (error) {
            return responder.error(res, error.details[0].message, 400);
        }
        try {
            const AlreadyExist = await Faculty.findOne({ email });
            if (AlreadyExist) {
                return responder.error(res, "Account already Exist", 409);
            }
            else {
                const encryptedPassword = await bcrypt.hash(password, 10);
                const faculty = new Faculty({ ...req.body, email, firstName, lastName, branch, password: password });
                // const token = jwt.sign({ user_id: student._id, email: student._email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
                // student.token = token;
                await faculty.save();
                // console.log(student)

                // sendOtpVerificationEmail(student._id, student.email, res)
                return responder.success(res, { message: "Account Created Successfully!", faculty }, 201);
            }


        } catch (error) {
            return responder.error(res, error.message, 400);
        }
    },
    login: async (req, res) => {
        try {
            const { email, password, role } = req.body;
            if (!email || !password) {
                return responder.error(res, "Email or Password not present", 400);
            }

            if (role === "Admin") {
                var user = await Admin.findOne({ email });
            }
            else if (role === "Faculty") {
                var user = await Faculty.findOne({ email });
            }
            else if (role === "Student") {
                var user = await Student.findOne({ email });
            }


            if (!user) {
                return responder.error(res, "User not found", 400);
            }
            if (role === "Student" && !user.email_verified) {
                return responder.error(res, { error: "Email is not verified", userId: user._id }, 401);
            }
            const validPassword = user.role != "Faculty" ? await bcrypt.compare(password, user.password) : user.password === password;


            if (validPassword) {
                const maxAge = 3 * 60 * 60;
                const token = await user.generateAuthToken();
                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000, // 3hrs in ms
                });


                // const data = { userId: user.id, accessToken: token, role: user.role };
                return responder.success(res, { message: "Login Successfully", role: user.role }, 201);


            }

            return responder.error(res, "Unauthorized access", 400);


        } catch (error) {
            return responder.error(res, error.message, 400);
        }
    },
    // refreshToken: async (req, res) => {
    //     try {
    //         const { token } = req.body;
    //         if (!token) {
    //             return responder.error(res, "Invalid refreshToken", 401);
    //         }
    //         const validToken = await RefreshToken.findOne({ token: token });
    //         if (!validToken) {
    //             return responder.error(res, "Unauthorized access", 403);
    //         }
    //         jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    //             if (err) {
    //                 return responder.error(res, "Unauthorized access", 403);
    //             }
    //             const accessToken = jwt.sign({ userId: user.userId, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' })
    //             responder.success(res, { accessToken: accessToken }, 201)
    //         })
    //     } catch (error) {
    //         return responder.error(res, error.message, 400);
    //     }
    // },
    logout: async (req, res) => {
        try {
            // console.log("logout")
            res.locals.user.tokens = res.locals.user.tokens.filter((elem) => {

                return elem.token != res.locals.token;
            })
            // console.log(res.locals.user.tokens)
            res.clearCookie("jwt");

            await res.locals.user.save();


            return responder.success(res, { message: "Logout successfuly" }, 201);
        } catch (error) {
            return responder.error(res, error.message, 400);
        }
    },
    isLogin: async (req, res) => {
        try {
            return responder.success(res, { message: "Login Successfully", isLogin: true, role: res.locals.user.role, verified: res.locals.user.verified }, 201);
        } catch (error) {
            return responder.error(res, error.message, 400);
        }
    }
}



module.exports = controller;