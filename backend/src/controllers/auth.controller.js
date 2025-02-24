import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup=async(req,res)=>{
    const {email,fullname,password}=req.body
    try{
        if(!fullname||!email||!password)  
            return res.status(400).json({'message':'please provide all fields'})
        if(password.length<6)  
            return res.status(400).json({'message':'Password must be at least 6 characters'})

        const user= await User.findOne({email})
        if(user)
            return res.status(400).json({'message':'User with this email alraedy exists'})

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const newUser=new User({email,fullname,'password':hashedPassword})
        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save()

            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                profilePic:newUser.profilePic
            })
        }else{
            res.status(400).json({"message":"Invalid user data"})
        }
    }catch(err){
        console.log('Signup controller error:',err.message)
        res.status(500).json({"message":"Internal server error"})
    }   
}

export const login=async(req,res)=>{
    const {email,password}=req.body
    try{
        if(!email||!password)
            return res.status(400).json({'message':'please provide all fields'})
        const user=await User.findOne({email})
        if(!user)
            return res.status(400).json({'message':'User not found'})
        const isPasswordSame=await bcrypt.compare(password,user.password)
        if(!isPasswordSame){
            return res.status(400).json({'message':'Incorrect credentials'})
        }
        generateToken(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilePic:user.profilePic
        })
    }catch(err){
        console.log('Login controller error:',err.message)
        res.status(500).json({"message":"Internal server error"})
    }
}

export const logout=(req,res)=>{
    try {
        res.cookie('jwt','',{maxAge:0})
        res.status(200).json({'message':'logged out successfully'})
    } catch (err) {
        console.log('Logout controller error:',err.message)
        res.status(500).json({"message":"Internal server error"})
    }
}

export const updateProfile=async(req,res)=>{
    try {
        const {profilePic}=req.body
        if(!profilePic)
            return res.status(400).json({'message':'profile pic is not provided'})
        const userId=req.user._id
        const uploadResponse=await cloudinary.uploader.upload(profilePic)
        const updatedUser=await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new:true}
        )
        res.status(200).json(updatedUser)

    } catch (err) {
        console.log('Upadte profile controller error:',err.message)
        res.status(500).json({"message":"Internal server error"})
        
    }
}

export const checkAuth=(req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (err) {
        console.log('Check auth controller error:',err.message)
        res.status(500).json({"message":"Internal server error"})
    }
}