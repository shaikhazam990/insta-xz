const express = require("express")
const cookieparser = require("cookie-parser")


const app = express()
app.use(express.json())
app.use(cookieparser())

// require routes
const authRouter = require("./routes/auth.route")
const postRouter = require("./routes/post.route")


// using routes
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)


module.exports=app