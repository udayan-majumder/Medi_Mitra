import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import medicineRouter from "./routes/medicine.routes.js"
import pharmacyRouter from "./routes/pharmacy.routes.js"
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

app.use("/user",userRouter)

//medicine route
app.use("/medicine",medicineRouter)

//pharmacy route
app.use("/pharmacy",pharmacyRouter)

app.listen(PORT,()=>{
    console.log(`server is running on localhost:${PORT}`)
})




