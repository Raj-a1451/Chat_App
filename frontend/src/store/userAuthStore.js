import {create} from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const userAuthStore=create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers:[],

    isCheckingAuth:true,
    checkAuth: async()=>{
        try {
            const res=await axiosInstance.get('/auth/check')
            set({authUser:res.data})
        } catch (err) {
            console.log('Error in checkAuth:',err)
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },

    signup:async(data)=>{
        set({isSigningUp:true})
        try {
            const res=await axiosInstance.post('/auth/signup',data)
            set({authUser:res.data})
            toast.success('Account created successfully')
        } catch (err) {
            console.log(err.response.data.message)
            toast.error(err.response.data.message)
        }finally{
            set({isSigningUp:false})
        }
    },

    logout:async()=>{
        try {
            await axiosInstance.post('/auth/logout')
            set({authUser:null})
            toast.success('Logged out successfully')
        } catch (err) {
            console.log(err.response.data.message)
            toast.error(err.response.data.message)
        }
    },

    login:async(data)=>{
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post('/auth/login',data)
            set({authUser:res.data})
            toast.success('Logged in successfully')
        } catch (err) {
            console.log('Error in login:',err.response.data.message)
            toast.error(err.response.data.message)
        }finally{
            set({isLoggingIn:false})
        }
    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile:true})
        try {
            const res=await axiosInstance.put('/auth/update-profile',data)
            set({authUser:res.data})
            toast.success('Profile is updated successfully')
        } catch (error) {
            console.log(error.response.data.message)
            toast.error(error.response.data.message)
        }finally{
            set({isUpdatingProfile:false})
        }
    }

}))