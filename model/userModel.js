const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
    },
    image: {
        type: String,
    },
    password: {
        type: String,
    },
    about: {
        type: String,
    },
    institute: {
        type: String,
    },
    role: {
        type: String,
    },
    country: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    twitter: {
        type: String,
    },
    facebook: {
        type: String,
    },
    instagram: {
        type: String,
    },
    linkedin: {
        type: String
    },
});

let userInfo = mongoose.model("user", userSchema);
module.exports = userInfo;