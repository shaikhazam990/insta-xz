const express = require("express")


const app = express()
app.use(express.json())

// require routes
const authRouter = require("./routes/auth.route")


// using routes
app.use("/api/auth", authRouter)

module.exports=app