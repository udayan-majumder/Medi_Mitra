import express from "express"
import dotenv from "dotenv"
import RegisterRoute from "./routes/register.routes.js"
import MedicineRouter from "./routes/medicine.routes.js"
import LoginRoute from "./routes/login.routes.js"
import UserDetailsRoute from "./routes/userdetails.routes.js"

import cors from "cors"
import cookieParser from "cookie-parser"
dotenv.config()

const app = express()
const PORT = process.env.PORT

//required setups
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors({
    methods:["GET","POST","UPDATE","DELETE"],
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(cookieParser())


// User Routes 
app.use("/user",RegisterRoute)
app.use("/user",LoginRoute)
app.use("/user",UserDetailsRoute)
//medicine route
app.use("/medicine",MedicineRouter)

app.listen(PORT,()=>{
    console.log(`server is running on localhost:${PORT}`)
})




