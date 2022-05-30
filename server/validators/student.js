const Joi = require('joi');

const branch = ['CSE', 'IS', 'ECE'];

const createStudent = data => {

    const schema = Joi.object().keys({
        firstName: Joi.string().min(3).max(40).required(),
        lastName: Joi.string().min(3).max(40).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(10).max(10).required(),
        password: Joi.string().min(6).max(40).required(),
        branch: Joi.string().valid(...branch).required(),
    });

    return schema.validate(data);
}


module.exports = {
    createStudentValidation: createStudent
}