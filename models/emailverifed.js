const mongoose = require('mongoose');

const emailverifed = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    otp: String,
    tokenExpiry: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
})

const User = mongoose.model('email', emailverifed);
module.exports = User;