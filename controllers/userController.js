const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser=asyncHandler(async (req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are required");
    }
    const userAvailable=await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("Email already registered");
    }
    const hashedPassword= await bcrypt.hash(password,10);
    console.log(hashedPassword);
    const user=await User.create({
        username,
        email,
        password:hashedPassword,
});
    if(user){
        return res.status(200).json({_id:user.id,email:user.email});
    }
    else{
        res.status(400);
        throw new Error("user data is not valid");
    }


});

//@desc Login User
//@route POST /api/users/login
//@access public
const loginUser= asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are required");
    }
    const user=await User.findOne({email});
    console.log(user);
    if( user && await bcrypt.compare(password,user.password)){
        const accessToken=jwt.sign(
            {
                
                username: user.username,
                email:user.email,
                id:user.id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"15m"} 
        );
        res.status(200).json({accessToken});
    }
    else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser =asyncHandler(async(req, res)=>{
    res.json(req.user);
});


module.exports={
    registerUser,
    loginUser,
    currentUser
};