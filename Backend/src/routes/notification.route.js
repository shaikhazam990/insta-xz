const express = require("express")
const identifyUser = require("../middlewares/auth.middleware")
const notificationController = require("../controllers/notification.controller")

const notificationRouter = express.Router()

notificationRouter.get("/", identifyUser, notificationController.getNotificationsController)
notificationRouter.get("/unread-count", identifyUser, notificationController.getUnreadCountController)

module.exports = notificationRouter