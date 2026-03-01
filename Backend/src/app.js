const express = require("express")
const cookieparser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cookieparser())
app.use(cors({
  origin: [
    "http://localhost:5173",        // local dev
    "https://insta-xz.vercel.app"   // ✅ production (Vercel)
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

//   require routes
const postRouter = require("./routes/post.route")
const authRouter = require("./routes/auth.route")
const userRouter = require("./routes/user.route")
const notificationRouter = require("./routes/notification.route")

// using routes
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)
app.use("/api/notifications", notificationRouter)

module.exports=app