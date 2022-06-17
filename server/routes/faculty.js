const router = require('express').Router();
const facultyController = require('../controllers/faculty');
const dataMiddleware = require('../middlewares/data');



// All routes relating to all attendees

router.get("/students", facultyController.getAllStudents);
router.get("/events", facultyController.getAllEvents);
router.get("/statistics/:branch", facultyController.getStatistics);
router.get("/events/:id", dataMiddleware.isValidMongoooseId, facultyController.getEvent);

router.get("/events/category/:category", dataMiddleware.isValidCategory, facultyController.getEventsByCategory);

router.post("/student/:id/verifyStudent", dataMiddleware.isValidMongoooseId, facultyController.verifyStudent);
router.patch("/student/:id", dataMiddleware.isValidMongoooseId, facultyController.updateStudent);
router.get("/student/:id/getRegisteredEvents", dataMiddleware.isValidMongoooseId, facultyController.getRegisteredEvents);



module.exports = router;