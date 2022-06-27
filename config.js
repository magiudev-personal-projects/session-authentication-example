require("dotenv").config();

module.exports = {
    port: process.env.PORT,
    dbUrl: process.env.DB_URL,
    sessionSecret: process.env.SESSION_SECRET
}