const express = require("express");
const {default: mongoose} = require("mongoose");
const MongoStore = require('connect-mongo');
const session = require("express-session");

const {port, dbUrl, sessionSecret} = require("./config");

const app = express();

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

// This endpoint serves to illustrate the use of sessions
app.get("/test-session", (req, res) => {
    if(req.session.viewCount) req.session.viewCount++;
    else req.session.viewCount = 1;
    res.send(`<h1>You have viewed this page ${req.session.viewCount} time(s)</h1>`);
});

app.listen(port, () => { console.log(`Server listening on port ${port}`)})