const express = require("express")

const postController = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({storage: multer.memoryStorage()})
const postRouter = express.Router()
const identifyUser = require("../middlewares/auth.middleware")


const postModel = require("../models/post.model")


postRouter.post("/", identifyUser, upload.single("image"),postController.CreatePostController)

// GET api/posts/ [protected]

postRouter.get("/",identifyUser, postController.getPostController)

// api/posts/details/id of that user want to fetch

postRouter.get("/details/:postId",identifyUser, postController.getPostDetailsController)


postRouter.post("/like/:postId", identifyUser, postController.likePostController)
postRouter.post("/unlike/:postId", identifyUser, postController.unLikePostController)


// get => /api/posts/feed
postRouter.get("/search", identifyUser, async (req, res) => {
    const { q } = req.query
    if (!q || q.trim() === '') return res.json({ posts: [] })

    const posts = await postModel.find({
        caption: { $regex: q.trim(), $options: "i" }
    }).populate("user", "username profileImage").limit(20).lean()

    res.json({ posts })
})
postRouter.get("/feed", identifyUser, postController.getFeedController)

postRouter.get("/my-posts", identifyUser, async (req, res) => {
    const posts = await postModel.find({ user: req.user.id }).lean()
    res.json({ posts })
})




module.exports=postRouter