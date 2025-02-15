import Message from "../models/message.model";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar=async(req,res)=>{
    try {
        const loggedInUserId=req.user._id
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filteredUsers)
    } catch (err) {
        console.log('Error in getUsersForSidebar:',err.message)
        res.status(500).json({message:'Internal server error'})
    }
}

export const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params
        const myId=req.user._id
        const messages=await Message.find({
            $or:[
                {senderId:myId, recieverId:userToChatId},
                {senderId:userToChatId, recieverId:myId},
            ]
        })

        res.status(200).json({messages})
    } catch (err) {
        console.log('Error in getMessages:',err.message)
        res.status(500).json({message:'Internal server error'})
        
    }
}

export const sendMessage=async(req,res)=>{
    try {
        const {id:recieverId}=req.params
        const senderId=req.user._id
        const {text,image}=req.body
        let imageurl
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageurl=uploadResponse.secure_url
        }
        const message=new Message({
            senderId,
            recieverId,
            text,
            image:imageurl
        })
        await message.save()
        res.status(201).json(message)
    } catch (err) {
        console.log('Error in sendMessage:',err.message)
        res.status(500).json({message:'Internal server error'})
        
    }
}