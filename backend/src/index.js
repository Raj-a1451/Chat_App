import express from 'express';
import authRoutes from './routes/auth.route.js'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser'
import messageRoutes from './routes/message.route.js'
import cors from 'cors'
import { app, server } from './lib/socket.js';
import path from 'path'

const __dirname=path.resolve()

dotenv.config()
const port=process.env.PORT

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
connectDB()

app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)

if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}

server.listen(port,()=>{
    console.log('server is listening to port',port)
})