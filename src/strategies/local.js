const LocalStrategy = require("passport-local");
const {User} = require("../entities/user");
const {verifyPass} = require("../helpers/password");

const verify = async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if(!user) return done(null, false, {message: "Incorrect email or password (no such user)"}); // This message is saved in the session if the route that use the middleware passport.authenticate has enabled the option failureMessage

        const correctPassword = await verifyPass(password, user.password);
        if(!correctPassword) return done(null, false, {message: "Incorrect email or password (bad pass)"}); // This message is saved in the session if the route that use the middleware passport.authenticate has enabled the option failureMessage

        done(null, user); // This user is passed to passport.serializeUser

    } catch (err) {
        done(err);
    }
}

const local = new LocalStrategy({usernameField: 'email'}, verify); // If we set passReqToCallback to true in the first argument, then we can access to the request in the verify function

module.exports = local;