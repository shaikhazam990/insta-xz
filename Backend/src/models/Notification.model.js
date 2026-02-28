const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    to: {
        type: String,   // username of who receives it
        required: true
    },
    from: {
        type: String,   // username of who triggered it
        required: true
    },
    type: {
        type: String,
        enum: ["like", "follow"],
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        default: null   // only for like notifications
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("Notification", notificationSchema)