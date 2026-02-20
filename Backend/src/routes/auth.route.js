const express = require("express")

const authController = require("../controllers/auth.controller")

const authRouter = express.Router()

authRouter.post("/register", authController.registerController)
authController.post("/login", authController.loginController)

module.exports=authRouter