const router = require('express').Router();
const adminController = require('../controllers/admin');
const dataMiddleware = require('../middlewares/data');

// All routes relating to the admin

router.post("/event", adminController.createEvent);

router.get("/event", adminController.getAllEvents);

router.get("/students", adminController.getAllStudents);
router.get("/statistics", adminController.getStatistics);

router.get("/faculty", adminController.getAllFaculties);
router.patch("/faculty/:id", dataMiddleware.isValidMongoooseId, adminController.updateFaculty);

router.patch("/event/:id", dataMiddleware.isValidMongoooseId, adminController.updateEvent);


router.delete("/event/:id", dataMiddleware.isValidMongoooseId, adminController.deleteEvent);
router.delete("/faculty/:id", dataMiddleware.isValidMongoooseId, adminController.deleteFaculty);
router.get("/student/:id/getRegisteredEvents", dataMiddleware.isValidMongoooseId, adminController.getRegisteredEvents);


module.exports = router;