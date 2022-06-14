const responder = require('../utils/responder');
const errorCodes = require('../utils/errors');

const middleware = {
    isAdmin: (req, res, next) => {
        if (res.locals.user.role === "Admin") {
            next();
        } else {
            responder.error(res, errorCodes.unAuthorized, 401);
        }
    },
    isFaculty: (req, res, next) => {
        if (res.locals.user.role === "Faculty") {
            next();
        } else {
            responder.error(res, errorCodes.unAuthorized, 401);
        }
    },
    isStudent: (req, res, next) => {

        if (res.locals.user.role === "Student") {
            next();
        } else {
            responder.error(res, errorCodes.unAuthorized, 401);
        }
    },

}


module.exports = middleware;