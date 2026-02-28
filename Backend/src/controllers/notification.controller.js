const notificationModel = require("../models/Notification.model")
// GET /api/notifications
const postModel = require("../models/post.model") 
async function getNotificationsController(req, res) {
    const username = req.user.username

    const notifications = await notificationModel
        .find({ to: username })
        .sort({ createdAt: -1 })
        .limit(30)
        .populate("post", "imgUrl caption")
        .lean()

    // mark all as read
    await notificationModel.updateMany(
        { to: username, read: false },
        { read: true }
    )

    res.status(200).json({ notifications })
}

// GET /api/notifications/unread-count
async function getUnreadCountController(req, res) {
    const username = req.user.username

    const count = await notificationModel.countDocuments({
        to: username,
        read: false
    })

    res.status(200).json({ count })
}

module.exports = {
    getNotificationsController,
    getUnreadCountController
}