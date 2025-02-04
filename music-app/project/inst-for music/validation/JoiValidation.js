const Joi = require('joi');

const userSchema = Joi.object({
    login: Joi.string().max(256).required(),
    password: Joi.string().max(256).required(),
    email: Joi.string().email().max(256).required(),
    role: Joi.string().valid('admin', 'user').required(),  
    name: Joi.string().max(256).required()
});

const trackSchema = Joi.object({
    musician_id: Joi.number().integer().required(),
    title: Joi.string().max(256).required(),
    genre: Joi.string().max(256).required(),
    link: Joi.string().max(512).required()
});

const commentSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    track_id: Joi.number().integer().required(),
    content: Joi.string().required(),
    created_data: Joi.date().required()
});

const likeSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    track_id: Joi.number().integer().required()
});

const subscriptionSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    track_id: Joi.number().integer().required()
});

module.exports = {
    userSchema,
    trackSchema,
    commentSchema,
    likeSchema,
    subscriptionSchema
};
