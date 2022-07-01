const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({ 
    email: 'string', 
    password: 'string' 
});

const User = mongoose.model('User', userSchema);

module.exports = {User};