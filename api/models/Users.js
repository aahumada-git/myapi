const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: [ true, 'Missing email field, please add some email']
    },
    password: String,
    salt: String,
    role: { 
        type: String, 
        default: 'user' 
    } // or admin

});

module.exports = mongoose.model('User',UserSchema);