const postModel = require("../models/post.model")
const notificationModel = require("../models/Notification.model")

const ImageKit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs");
const { Folders } = require("@imagekit/nodejs/resources.js");
// const { json } = require("express");

const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model");
const { post } = require("../routes/post.route");

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

async function CreatePostController(req,res){
    console.log(req.body, req.file)




  const file =  await client.files.upload({
  file: await toFile(Buffer.from(req.file.buffer), 'file'),
  fileName: 'test',
  folder:"cohort-2-insta-clone-posts"
});

    const post = await postModel.create({
        caption:req.body.caption,
        imgUrl: file.url,
        user:req.user.id
    })

    res.status(201).json({
        message: "post Created successfully",
        post
    })

    // res.send(file)
}


//  Get /API/POSTS/DETAILS/:POSTID
// RETURN the details of specific post with the id also check wheather
//  the post belongs to that the request coming from 

async function getPostController(req,res){



    const userId = req.user.id

    const post = await postModel.find({
        user:userId
    })

    res.status(200).json({
        message:"Post Fetched Successfully",
        post
    })

}

async function getPostDetailsController(req,res){



    const userId = req.user.id
    const postId = req.params.postId


    const post = await postModel.findById(postId)

    if(!post){
        return res.status(404).json({
            message:"Post not found with this id"
        })
    }

    const isValidUser = post.user.toString() === userId

    if(!isValidUser){
        return res.status(403).json({
            message:"Forbidden Content"

        })
    }

    return res.status(200).json({
        message:"Post Fetched Successfully"
    })








}
async function likePostController(req, res) {
    const username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({ message: "post not found." })
    }

    // ✅ Already liked hai to dobara like mat karo
    const alreadyLiked = await likeModel.findOne({ post: postId, user: username })

    if (alreadyLiked) {
        return res.status(400).json({ message: "Post already liked." })
    }

    const like = await likeModel.create({ post: postId, user: username })

    res.status(200).json({ message: "post liked successfully", like })
}

async function unLikePostController(req, res) {
    const postId = req.params.postId
    const username = req.user.username

    const isLiked = await likeModel.findOne({
        post: postId,
        user: username
    })

    if (!isLiked) {
        return res.status(400).json({
            message: "Post didn't like"
        })
    }

    await likeModel.findOneAndDelete({ _id: isLiked._id })

    return res.status(200).json({
        message: "post un liked successfully."
    })
}

async function getFeedController(req, res) {

    const user = req.user

    const posts = await Promise.all((await postModel.find().populate("user").lean())

    .map(async (post) => {
        const isLiked = await likeModel.findOne({
            user: user.username,
            post: post._id
        })

        const likeCount = await likeModel.countDocuments({ post: post._id }) 

        post.isLiked = Boolean(isLiked)
        post.likeCount = likeCount                                            
        return post
    }))

    res.status(200).json({
        message: "posts fetched successfully",
        posts
    })

}

async function likePostController(req, res) {
    const username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId).populate("user")  // ✅ .populate("user") add karo

    if (!post) {
        return res.status(404).json({ message: "post not found." })
    }

    const alreadyLiked = await likeModel.findOne({ post: postId, user: username })

    if (alreadyLiked) {
        return res.status(400).json({ message: "Post already liked." })
    }

    const like = await likeModel.create({ post: postId, user: username })

    // ✅ sirf ye block add karo
    const postOwner = post.user?.username
    if (postOwner && postOwner !== username) {
        await notificationModel.create({
            to: postOwner,
            from: username,
            type: "like",
            post: postId
        })
    }

    res.status(200).json({ message: "post liked successfully", like })
}
module.exports={
    CreatePostController,
    getPostController,
    getPostDetailsController,
    likePostController,
    getFeedController,
    unLikePostController,
    likePostController
}