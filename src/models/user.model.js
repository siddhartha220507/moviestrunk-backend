const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, "username already exists"]
    },
    email: {
        type: String,
        required: true,
        unique: [true, "email already exists"]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    isBanned: {
        type: Boolean,
        default: false
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel
