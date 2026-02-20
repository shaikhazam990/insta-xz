const express = require("express")


const app = express()
app.use(express.json())

// require routes
const authRouter = require("./routes/auth.route")
const postRouter = require("./routes/post.route")


// using routes
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)

module.exports=app