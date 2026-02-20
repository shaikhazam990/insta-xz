const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [ true, "User name already exists" ],
        required: [ true, "User name is required" ]
    },
    email: {
        type: String,
        unique: [ true, "Email already exists" ],
        required: [ true, "Email is required" ]
    },
    password: {
        type: String,
        required: [ true, "Password is required" ],
    },
    bio: String,
    profileImage: {
        type: String,
        default: "https://ik.imagekit.io/gdmcmlxtw/9e837528f01cf3f42119c5aeeed1b336.jpg?updatedAt=1770747607441"
    },
})


const userModel = mongoose.model("users", userSchema)

module.exports = userModel