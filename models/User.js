const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    age: Number,
    gender: String,
    lookingFor: String,

    // NEW FIELDS FOR EMAIL VERIFICATION
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    }
});

module.exports = mongoose.model("User", UserSchema);
