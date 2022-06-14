const Event = require('../models/Event');
const Student = require('../models/Student');
const responder = require('../utils/responder');
const Registration = require('../models/Registration');
const errorCodes = require('../utils/errors');
const errorCode = require('../utils/errors');
const sendTicket = require('../utils/sendTicket');
const { date } = require('joi');

const controller = {
    getAllEvents: async (req, res) => {
        try {
            let date = new Date()
            const allEvents = await Event.find({});
            const events = allEvents.filter(event => event.date >= date)
            responder.success(res, { message: "Events fetched successfully", events: events });
            // .then(events => {
            //     // console.log(events)
            // }).catch(err => {
            //     responder.error(res, err, 500);
            // });
        } catch (err) {
            responder.error(res, err, 500);
        }
    },
    getEvent: async (req, res) => {
        try {
            let event = await Event.findById(req.params.id);
            let registration = await Registration.findOne({ eventId: req.params.id, uid: res.locals.user.uid });
            responder.success(res, { message: "Event fetched successfully", category: req.params.category, event: event, registered: registration ? true : false });
        } catch (err) {
            responder.error(res, err, 500);
        }
    },
    getEventsByCategory: async (req, res) => {
        try {
            let queryParams = { "category": req.params.category };
            Event.find(queryParams)
                .then(events => {
                    responder.success(res, { message: "Events fetched by category successfully", events: events });
                }).catch(err => {
                    responder.error(res, err, 500);
                });
        } catch (err) {
            responder.error(res, err, 500);
        }
    },
    registerForEvent: async (req, res) => {
        try {

            const registrationExists = await Registration.findOne({ eventId: req.params.id, uid: res.locals.user._id });

            if (registrationExists) {
                return responder.error(res, errorCode.alreadyRegistered, 400);
            }

            let event = await Event.findById(req.params.id);
            let registration = await Registration.create({
                eventId: event._id,
                uid: res.locals.user._id,
                branch: res.locals.user.branch
            });


            sendTicket(res.locals.user.firstName, event.name, registration.registrationCode, res.locals.user.email);
            responder.success(res, { message: "Registration successful", registration: registration });
        } catch (err) {
            responder.error(res, err, 500);
        }
    },
    getRegisteredEvents: async (req, res) => {
        try {
            const uid = res.locals.user._id;
            // console.log("Events", res.locals.user._id)

            const register = await Registration.find({ uid: uid })
            const ids = register.map(r => r.eventId)
            const events = await Event.find({ _id: { $in: ids } })

            responder.success(res, { message: "events fetched successfully", events: events, numberOfEvents: events.length, registration: register });
        } catch (error) {
            return responder.error(res, error, 400);
        }
    }

}


module.exports = controller;