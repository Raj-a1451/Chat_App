import mongoose from "mongoose"

const messageSchema=mongoose.Schema(
    {
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'user'
        },
        recieverId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'user'
        },
        text:{
            type:String
        },
        image:{
            type:String
        }
    },
    {timestamps:true}
)

const Message=mongoose.model('message',messageSchema)
export default Message