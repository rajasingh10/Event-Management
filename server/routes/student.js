const router = require('express').Router();
const studentController = require('../controllers/student');
const dataMiddleware = require('../middlewares/data');
const studentMiddleware = require("../middlewares/student")


// All routes relating to all students

router.use(studentMiddleware.isvalid); //to check if student is verified


router.get("/events", studentController.getAllEvents);
router.get("/events/getRegisteredEvents", studentController.getRegisteredEvents);

router.get("/events/:id", dataMiddleware.isValidMongoooseId, studentController.getEvent);

router.get("/events/category/:category", dataMiddleware.isValidCategory, studentController.getEventsByCategory);

router.post("/events/:id/register", dataMiddleware.isValidMongoooseId, studentMiddleware.isTimeOverlap, studentController.registerForEvent);



module.exports = router;