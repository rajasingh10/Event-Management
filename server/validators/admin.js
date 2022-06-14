const Joi = require('joi');

const categories = ['music', 'dance', 'gaming', 'literary', 'lifestyle', 'instracollege', 'mestori', 'technical', 'photography', 'adventure', 'kannada', 'sports', 'miscellaneous'];

const createEvent = data => {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().min(3).max(1000).required(),
        date: Joi.date().required(),
        time: Joi.string().min(3).max(40).required(),
        rules: Joi.array().items(Joi.string()).min(1),
        venue: Joi.string().min(3).max(40),
        image: Joi.string().uri(),
        prize: Joi.string().min(3).max(40),
        fees: Joi.number().min(0).required(),
        category: Joi.string().valid(...categories).required(),

    });

    return schema.validate(data);
}


module.exports = {
    createEventValidation: createEvent
}