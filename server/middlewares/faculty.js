const responder = require('../utils/responder');
const errorCodes = require('../utils/errors');

const middleware = {
    respectiveBranch: (req, res, next) => {

        if (!res.locals.user.verified) {
            return responder.error(res, "Your account is not Approved yet", 202);
        }
        next();
    },

}


module.exports = middleware;