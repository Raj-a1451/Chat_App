import mongoose from "mongoose"

const messageSchema=mongoose.Schema(
    {
        content:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
)

const Message=mongoose.model('message',messageSchema)
export default Message