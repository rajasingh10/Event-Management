const router = require('express').Router();
const auth = require('./auth.js');
const roleMiddleware = require('../middlewares/role')
const student = require('./student.js');
const admin = require('./admin.js');
const faculty = require('./faculty.js');
const authJwtMiddleware = require('../middlewares/authJwt.js');

//required no authentication

router.use('/auth', auth);

//required authentication to get all end points

router.use(authJwtMiddleware.authenticateJWT)


router.use('/student', roleMiddleware.isStudent, student);
router.use('/admin', roleMiddleware.isAdmin, admin);
router.use('/Faculty', roleMiddleware.isFaculty, faculty);


module.exports = router;