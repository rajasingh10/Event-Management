const Event = require('../models/Event');
const Student = require('../models/Student');
const responder = require('../utils/responder');
const Registration = require('../models/Registration');



const controller = {
    getAllEvents: async (req, res) => {
        try {
            Event.find({})
                .then(events => {
                    responder.success(res, { message: "Events fetched successfully", events: events });
                }).catch(err => {
                    responder.error(res, err, 500);
                });
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
    getAllStudents: async (req, res) => {
        try {
            const branch = res.locals.user.branch;
            Student.find({ branch: branch, email_verified: true })
                .then(students => {
                    responder.success(res, { message: "students fetched successfully", students: students });
                }).catch(err => {
                    responder.error(res, err, 500);
                });
        } catch (err) {
            responder.error(res, err, 500);
        }
    },
    verifyStudent: async (req, res) => {
        try {

            Student.findByIdAndUpdate(req.params.id, { ...req.body, verified: true }, { new: true }, (err, updatedStudent) => {
                if (err) return responder.error(res, err, 400);
                return responder.success(res, { message: "Student Verified Successfully", updatedStudent: updatedStudent }, 201);
            })
        } catch (error) {
            return responder.error(res, error, 400);
        }
    },
    getRegisteredEvents: async (req, res) => {
        try {
            const uid = req.params.id;
            const register = await Registration.find({ uid: uid })
            const ids = register.map(r => r.eventId)
            const events = await Event.find({ _id: { $in: ids } })
            responder.success(res, { message: "events fetched successfully", events: events, numberOfEvents: events.length, registrations: register });
        } catch (error) {
            return responder.error(res, error, 400);
        }
    },
    getStatistics: async (req, res) => {
        try {
            // console.log("stats")
            const eId = await (Event.find({}));
            const stats = await Promise.all(eId.map(async e => {
                const reg = await Registration.find({ eventId: e._id })
                // console.log(e.name, reg.length)
                return { "name": e.name, "count": reg.length }
            }))

            responder.success(res, { message: "Statistics fetched successfully", stats: stats });
        } catch (error) {
            return responder.error(res, error, 400);
        }
    },
    updateStudent: async (req, res) => {
        try {
            const { firstName, lastName, branch } = req.body;
            if (!firstName || !lastName || !branch) {
                return responder.error(res, "Empty value is not allowed", 400);
            }
            Student.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }, (err, updatedStudent) => {
                if (err) return responder.error(res, err, 400);
                return responder.success(res, { message: "Student updated Successfully", event: updatedStudent }, 201);
            })
        } catch (error) {
            return responder.error(res, error, 400);
        }
    },
}


module.exports = controller;