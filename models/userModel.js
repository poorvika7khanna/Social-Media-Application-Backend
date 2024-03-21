const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add the user name"],
    },
    email: {
        type: String,
        required: [true, "Please add the user email address"],
        unique: [true, "Email address already taken"],
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
    },
    bio: {
        type: String,
    },
    image_url: {
        type: String,
    },
    profileType: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    authMethod: {
        type: String,
        required: true,
    },
}, 
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);