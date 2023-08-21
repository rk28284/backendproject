const express=require("express")
const connection=require("./configs/db")
const {userRouter}=require("./route/user.Route")
const {doctorRouter}=require("./route/doctor.Route")
const {authentication}=require("./middleware/auth.middleware")

require("dotenv").config()
const cors=require("cors")
const app=express()
app.use(express.json())
const port=process.env.port|| 8080

app.use(cors())
app.get("/",(req,res)=>{
    res.send("Welcome to homepage of Doctores Backend")
})

app.use("/user",userRouter)
// app.use(authentication)
app.use("/appointments",doctorRouter)
app.listen(port,async()=>{
    try {
        await connection
        console.log("Connnection succesfully to db")
    } catch (error) {
      console.log(error)  
    }
    console.log("Port Running at 8080")
})