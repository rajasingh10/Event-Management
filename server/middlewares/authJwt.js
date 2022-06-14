const responder = require('../utils/responder');
const errorCodes = require('../utils/errors');
const jwt = require("jsonwebtoken");
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Faculty = require('../models/Faculty');

const middleware = {
    authenticateJWT: async (req, res, next) => {
        try {
            const token = req.cookies.jwt;

            // const authHeader = req.headers.authorization;

            if (token) {
                // const token = authHeader.split(' ')[1];
                // console.log(token)
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => { //this data is decoded data of token
                    if (err) {
                        return responder.error(res, errorCodes.unAuthorized, 403);
                    }


                    if (data.role === "Admin") {
                        const user = await Admin.findOne({ _id: data._id });

                        //handle if user is logout,means token got deleted
                        const validToken = user.tokens.filter((elem) => {
                            return elem.token == token;
                        })

                        if (validToken.length <= 0) {
                            return responder.error(res, errorCodes.unAuthorized, 403);
                        }
                        res.locals.user = user;
                    }
                    else if (data.role === "Faculty") {
                        const user = await Faculty.findOne({ _id: data._id });
                        const validToken = user.tokens.filter((elem) => {
                            return elem.token == token;
                        })

                        if (validToken.length <= 0) {
                            return responder.error(res, errorCodes.unAuthorized, 403);
                        }
                        res.locals.user = user;
                    }
                    else if (data.role === "Student") {
                        const user = await Student.findOne({ _id: data._id });
                        const validToken = user.tokens.filter((elem) => {
                            return elem.token == token;
                        })

                        if (validToken.length <= 0) {
                            return responder.error(res, errorCodes.unAuthorized, 403);
                        }
                        res.locals.user = user;
                    }
                    res.locals.token = token;
                    next();
                })
            }
        } catch (error) {
            return responder.error(res, error.message, 400);
        }
    }
}


module.exports = middleware;