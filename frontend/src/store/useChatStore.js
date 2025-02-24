import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers:async()=>{
        set({isUsersLoading:true})
        try {
            const res = await axiosInstance.get('/message/users')
            set({users:res.data})
        } catch (err) {
            console.log('Error in getUsers',err.response.data.message)
            toast.error(err.response.data.message)
        }finally{
            set({isUsersLoading:false})
        }
    },

    getMessages:async(userId)=>{
        set({isMessagesLoading:true})
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({messages:res.data})
        } catch (err) {
            console.log('Error in getMessages',err.response.data.message)
            toast.error(err.response.data.message)
        }finally{
            set({isMessagesLoading:false})
        }
    },

    sendMessage:async(messageData)=>{
        const {messages,selectedUser}=get()
        try {
            const res=await axiosInstance.post(`/message/send/${selectedUser}`,messageData)
            set({messages:[...messages,res.data],})
        } catch (err) {
            console.log("Error in sendMessage",err.response.data.message)
            toast.error(err.response.data.message)
        }
    },

    //later
    setSelectedUser:(selectedUser)=>set({selectedUser}),

}))