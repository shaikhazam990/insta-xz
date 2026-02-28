const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")

async function unfollowUserController(req,res) {
    const followerUsername = req.user.username

    const follloweeUsername = req.params.username

    const isUserFollowing = await followModel.findOne({
        follower : followerUsername,
        followee: follloweeUsername
    })

    if(!isUserFollowing){
        return res.status(200).json({
            message: `You are not following ${follloweeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message:` you have unfollowed ${follloweeUsername}`
    })
    
}

// paste this in user.controller.js — add this require at the top:
// const notificationModel = require("../models/notification.model")

async function followUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    if (followeeUsername === followerUsername) {
        return res.status(400).json({ message: "You cannot follow yourself" })
    }

    const isfolloweeExists = await userModel.findOne({ username: followeeUsername })

    if (!isfolloweeExists) {
        return res.status(404).json({ message: "User you are trying to follow does not exist" })
    }

    const isAlreadyFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (isAlreadyFollowing) {
        return res.status(200).json({
            message: `You are already following ${followeeUsername}`,
            follow: isAlreadyFollowing
        })
    }

    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername
    })

    // ✅ create notification
    await notificationModel.create({
        to: followeeUsername,
        from: followerUsername,
        type: "follow"
    })

    res.status(200).json({
        message: `You are now following ${followeeUsername}`,
        follow: followRecord
    })
}


module.exports={
    unfollowUserController,
    followUserController

}