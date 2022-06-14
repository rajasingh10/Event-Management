const responder = require('../utils/responder');
const errorCodes = require('../utils/errors');
const Registration = require('../models/Registration');
const Event = require('../models/Event');



const middleware = {
    isvalid: (req, res, next) => {
        // console.log(res.locals.user.verified)
        if (!res.locals.user.verified) {
            return responder.error(res, "Your account is not Approved yet", 202);
        }
        next();
    },
    isTimeOverlap: async (req, res, next) => {
        try {
            const currentEvent = await Event.findById(req.params.id);
            let flag = 0;
            let eventObj = {};
            const uid = res.locals.user._id;
            const register = await Registration.find({ uid: uid })
            const ids = register.map(r => r.eventId)
            const events = await Event.find({ _id: { $in: ids } })
            events.map(event => {
                if (event.time === currentEvent.time && event.date === currentEvent.date) {
                    flag = 1;
                    eventObj = event;
                }
            })

            if (flag === 1) {
                return responder.error(res, `Overlap of timing with existing event ${eventObj.name}`, 202);
            }

            next()
        } catch (error) {
            return responder.error(res, error, 400);
        }
    },


}


module.exports = middleware;