import app from "./app.js";
import connectDb from "./db/db.js";
import dotenv from "dotenv"

dotenv.config({
    path:'./.env'
})
connectDb()
.then(()=>{
app.listen(process.env.PORT || 3001 ,()=>{
    console.log(`db is running at port : ${process.env.PORT}`);
    
})
})
.catch((error)=>{
console.log("error connection failed",error);

})