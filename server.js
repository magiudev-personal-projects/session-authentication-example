const express = require("express");
const {default: mongoose} = require("mongoose");
const MongoStore = require('connect-mongo');
const session = require("express-session");
const passport = require("passport");

const {port, dbUrl, sessionSecret} = require("./config");
const {User} = require("./src/entities/user");
const local = require("./src/strategies/local");

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Connect with the db or throw an error if it fails
const dbConnection = mongoose.connect(dbUrl);

// Set up the session storage
const store = MongoStore.create({
    mongoUrl: dbUrl,
    collectionName: "sessionsss"
});

// Set up express-session
app.use(session({
   secret: sessionSecret,
   saveUninitialized: false, // If false, express-session doesn't create a session until something is stored
   resave: false, // If false, express-session doesn't save session if unmodified
   store,
   cookie: {maxAge: 1000 * 60 * 60 * 24} // Set the expiration date to 1 day (in ms) from now
}));

// Set up passport
app.use(passport.initialize()); // https://github.com/jaredhanson/passport#middleware
app.use(passport.session()); // https://github.com/jaredhanson/passport#middleware
passport.serializeUser((user, done)=> { done(null, user.id) }); // This function saves user data (the user id) in the session. The data is obtained from the strategy.
passport.deserializeUser( async (id, done)=> { // This function take the data stored in the session, search the user in the db, and saves the user in the request
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Add the routes
app.use(require("./src/routes")); 

passport.use(local);

app.listen(port, () => { console.log(`Server listening on port ${port}`)})