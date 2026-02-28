const express = require("express")

const UserController = require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware")

const userModel = require("../models/user.model")
const followModel = require("../models/follow.model")

const userRouter = express.Router()


// @route = post/api/users/follow/:userid
// @description = follow a user
// @access = private


userRouter.post("/follow/:username", identifyUser,UserController.followUserController)

userRouter.post("/unfollow/:username", identifyUser, UserController.unfollowUserController)

// 1. Apne posts fetch karne ke liye


// 2. Followers/Following count
userRouter.get("/follow-counts/:username", identifyUser, async (req, res) => {
    const { username } = req.params
    const followersCount = await followModel.countDocuments({ followee: username })
    const followingCount = await followModel.countDocuments({ follower: username })
    res.json({ followersCount, followingCount })
})

// 3. Profile update
userRouter.patch("/update", identifyUser, async (req, res) => {
    const { username, bio } = req.body
    const updated = await userModel.findByIdAndUpdate(
        req.user.id,
        { username, bio },
        { new: true }
    ).select("-password")
    res.json({ user: updated })
})

userRouter.get("/search", identifyUser, async (req, res) => {
    const { q } = req.query
    if (!q || q.trim() === '') return res.json({ users: [] })

    const users = await userModel.find({
        username: { $regex: q.trim(), $options: "i" }
    }).select("username bio profileImage").limit(10).lean()

    res.json({ users })
})


module.exports=userRouter