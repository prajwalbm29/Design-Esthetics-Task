const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps: true});

module.exports = new mongoose.model("user", userSchema);