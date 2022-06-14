const Joi = require('joi');

const branch = ['CSE', 'IS', 'ECE', 'ME', 'EEE', 'MCA'];

const createRegistration = data => {
    const schema = Joi.object().keys({
        eventId: Joi.string().min(3).max(1000).required(),
        uid: Joi.string().min(3).max(1000).required(),
        branch: Joi.string().valid(...branch).required(),
        registeredOn: Joi.date().required(),
        registrationCode: Joi.string().min(3).max(20).required()
    });

    return schema.validate(data);
}


module.exports = {
    createRegistrationValidation: createRegistration
}