const responder = require('../utils/responder');
const Event = require('../models/Event');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Registration = require('../models/Registration');
const { createEventValidation } = require('../validators/admin');
const { createFacultyValidation } = require('../validators/faculty');



const controller = {
    createEvent: async (req, res) => {
        try {
            const { error } = createEventValidation(req.body);
            if (error) return responder.error(res, error.details[0].message, 400);

            const event = new Event({ ...req.body });

            event.save((err, newEvent) => {
                if (err) return responder.error(res, err, 400);
                return responder.success(res, { message: "Event created Successfully", event: newEvent }, 201);
            })
        } catch (error) {
            return responder.error(res, error, 400);
        }
    },
    updateEvent: async (req, res) => {
        try {
            const { error } = createEventValidation(req.body);
            if (error) return responder.error(res, error.details[0].message, 400);

            Event.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }, (err, updatedEvent) => {
                if (err) return responder.error(res, err, 400);
                return responder.success(res, { message: "Event updated Successfully", event: updatedEvent }, 201);
            })
        } catch (error) {
            return responder.error(res, error, 400);
        }
    },
    deleteEvent: async (req, res) => {
        try {
            await Registration.deleteMany({ eventId: req.params.id });
            Event.findByIdAndDelete(req.params.id, (err, deletedEvent) => {
                if (err) return responder.error(res, err, 400);
                return responder.success(res, { message: "Event deleted Successfully", event: deletedEvent }, 201);
            })
        } catch (error) {
            return responder.error(res, error, 400);
        }
    },
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
    getAllStudents: async (req, res) => {
        try {

            Student.find({ email_verified: true })
                .then(students => {
                    responder.success(res, { message: "students fetched successfully", students: students });
                }).catch(err => {
                    responder.error(res, err, 500);
                });
        } catch (err) {
            responder.error(res, err, 500);
        }
    },
    getAllFaculties: async (req, res) => {
        try {

            Faculty.find({})
                .then(faculties => {
                    responder.success(res, { message: "faculty fetched successfully", faculties: faculties });
                }).catch(err => {
                    responder.error(res, err, 500);
                });
        } catch (err) {
            responder.error(res, err, 500);
        }
    },
    updateFaculty: async (req, res) => {
        try {
            const { error } = createFacultyValidation(req.body);
            if (error) return responder.error(res, error.details[0].message, 400);

            Faculty.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }, (err, updatedFaculty) => {
                if (err) return responder.error(res, err, 400);
                return responder.success(res, { message: "Faculty updated Successfully", event: updatedFaculty }, 201);
            })
        } catch (error) {
            return responder.error(res, error, 400);
        }
    },
    deleteFaculty: async (req, res) => {
        try {
            Faculty.findByIdAndDelete(req.params.id, (err, deletedFaculty) => {
                if (err) return responder.error(res, err, 400);
                return responder.success(res, { message: "Faculty deleted Successfully", faculty: deletedFaculty }, 201);
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
    }
}


module.exports = controller;