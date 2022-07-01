const {Router} = require("express");
const passport = require("passport");
const {User} = require("../entities/user");
const {hashPass} = require("../helpers/password");
const {checkAuthStatus} = require("../middlewares/auth");

const router = Router();

// Render a protected welcome page
router.get("/", checkAuthStatus(true, "/login"), (req, res) => {
    res.send(`
        <h1>Welcome ${req.user.email}</h1>
        <button id="logout">Log out</button>
        <script>
            const logOutBtn = document.getElementById("logout");
            logOutBtn.addEventListener("click", async () => {
                await fetch("/logout", {
                    method: "DELETE"
                });
                location.replace("login")
            });
        </script>
    `);
});

// Serve register form
router.get("/register", checkAuthStatus(false, "/"), (req, res) => {
    res.send(`
        <h1>Register</h1>
        <form action="/register" method="post">
            <div>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" />
            </div>
            <div>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" />
            </div>
            <div>
                <input type="submit" value="Register"/>
            </div>
        </form>
        <a href="/login">Log in</a>
    `);
});

// Register user
router.post("/register", async (req, res) => {
    const {email, password} = req.body;
    const hashedPassword = await hashPass(password);
    const user = new User({ email, password: hashedPassword});
    await user.save();
    res.redirect("/login");
});

// Serve log in form 
router.get("/login", checkAuthStatus(false, "/"), (req, res) => {

    // Check if there is a message
    let msg = "";
    if(req.session?.messages) {
        msg = req.session.messages;
        req.session.messages = [];
    }

    res.send(`
        <h1>Log in</h1>
        <p style="color:red">${msg}</p>
        <form action="/login" method="post">
            <div>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" />
            </div>
            <div>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" />
            </div>
            <div>
                <input type="submit" value="Log in"/>
            </div>
        </form>
        <a href="/register">Register</a>
    `);
});

// Log in
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
    failureMessage: true, // Register the failure message created in the verify function of the strategy in session.messages
    // failureFlash: true 
})); 

// Log out
router.delete("/logout", (req, res) => {
    req.logOut((error) => {
        if(error) return console.log(error);
        res.json({ message: "Session finished"});
        // res.redirect("/login");
    });
});

module.exports = router;