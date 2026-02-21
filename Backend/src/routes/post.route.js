const express = require("express")

const postRouter = express.Router()
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })
const identifyUser = require("../middleware/auth.middleware")

const postController = require("../controllers/post.controller")
const getController = require("../controllers/post.controller")
const getDeatilsController = require("../controllers/post.controller")
const likeController = require("../controllers/post.controller")

postRouter.post("/", upload.single("image") , identifyUser , postController.createPostController)

postRouter.get("/", identifyUser, getController.getPostController)

postRouter.get("/details/:postId", identifyUser, getDeatilsController.getPostDetailsController)

postRouter.post("/like/:postId", identifyUser, likeController.likePostController)

module.exports=postRouter

