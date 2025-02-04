const { userSchema, trackSchema, commentSchema, likeSchema, subscriptionSchema } = require('./JoiValidation.js');

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateTrack = (req, res, next) => {
    const { error } = trackSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateLike = (req, res, next) => {
    const { error } = likeSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateSubscription = (req, res, next) => {
    const { error } = subscriptionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateUser,
    validateTrack,
    validateComment,
    validateLike,
    validateSubscription
};
