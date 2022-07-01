const {hash, genSalt, compare} = require("bcrypt");

const hashPass = async (plainTextPassword) => {
    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const passwordHashed = await hash(plainTextPassword, salt);
    return passwordHashed;
}

const verifyPass = (plainTextPassword, hashedPassword) =>  (compare(plainTextPassword, hashedPassword));

module.exports = {
    hashPass,
    verifyPass
}
