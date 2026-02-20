const userModel = require("../model/user.model")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


async function registerController(req,res){
    const{username, email, bio,profileImage, password} = req.body

    const isAlreadyuserExist = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    }) 

    if(isAlreadyuserExist){
        return isAlreadyuserExist.email ? "email aready exists" : "username already exists"
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,email, profileImage, bio, password:hash
    })
    
    const token = jwt.sign(
        {
            id:user._id,
            username:user.username
        },
        process.env.JWT_SECRET
    )
    res.cookie("token", token)

    res.status(201).json({
        message:"user registerd successfully",
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })

    

}

async function loginController(req,res){
    const{username, email, password} = req.body

    const user = await userModel.findOne({
        $or: [
            {username: username},
            {email: email}
        ]
    })

    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }

    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
        return res.status(401).json({
            message: "password invalid"
        })
    }
    const token = jwt.sign(
        {
            id:user._id,
            username:user.username
        },
        process.env.JWT_SECRET
    )
    res.cookie("token", token)

    return res.status(201)
        .json({
            message: "User loggedIn successfully.",
            user: {
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage
            }
        })
    
}

async function getMeController(req,res){
    const userId = req.user.id
    const user = await userModel.findById(userId)

    return res.status(200).json({
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}


module.exports={
    registerController,
    loginController,
    getMeController
}