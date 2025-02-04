const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('./models/user.js');
const { jwtSecret } = require('./config.js');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    User.findByPk(jwtPayload.id)
        .then(user => {
            if (user) {
                console.log('User authenticated:', user.login);
                return done(null, user);
            }
            return done(null, false);
        })
        .catch(err => done(err, false));
}));

module.exports = passport;
