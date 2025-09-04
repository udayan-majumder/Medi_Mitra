import express from "express"
import dotenv from "dotenv"
import RegisterRoute from "./routes/register.routes.js"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())


app.use("/user",RegisterRoute)


app.listen(PORT,()=>{
    console.log(`server is running on localhost:${PORT}`)
})




