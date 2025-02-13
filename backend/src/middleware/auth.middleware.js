import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt
        if(!token){
            res.status(400).json({'message':'Unauthorized-token not provided'})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded)
            res.status(400).json({'message':'Unauthorized-invalid token'})
        const user=await User.findById(decoded.userId).select("-password")
        if(!user)
            res.status(400).json({'message':'User not found'})
        req.user=user
        next()

    } catch (err) {
        console.log('Error in protect route:',err.message)
        res.status(500).json({'message':'Internal server error'})
    }
}

