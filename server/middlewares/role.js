const responder = require('../utils/responder');
const errorCodes = require('../utils/errors');

const middleware = {
    isAdmin: (req, res, next) => {
        if (req.user.role === "admin") {
            next();
        } else {
            responder.error(res, errorCodes.unAuthorized, 401);
        }
    },
    isFaculty: (req, res, next) => {
        if (req.user.role === "faculty") {
            next();
        } else {
            responder.error(res, errorCodes.unAuthorized, 401);
        }
    },
    isStudent: (req, res, next) => {
        if (req.user.role === "student") {
            next();
        } else {
            responder.error(res, errorCodes.unAuthorized, 401);
        }
    },

}


module.exports = middleware;