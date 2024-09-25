import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/AppError.js";
import { User } from "../models/user.models.js";
import { uploadImage } from "../utils/cloudnry.js";
const registerUser =asyncHandler(async(req,res)=>{
    // res.status(200).json({
        // message:"Your first Server is working"
        const {fullname,username,email,password}=req.body
        console.log("email:",email);
        console.log("username:",username);
        console.log("password:",password);
        console.log(fullname);
      

        if(
            [fullname,email,username,password].some((field)=>
            field?.trim()==="" )|| 
            !email.includes("@gmail.com")
        ){
            throw new ApiError(400,"Fill all fields")
        }
        if(!email.includes("@gmail.com")){ 
            throw new ApiError(402,"Plz Provide valid Email Adress")
        }

      const existedUser=  User.findOne({
            $or:[{username},{email}]
        })
        if(existedUser){
            throw new ApiError(409,"User with same id or email already exists")
        }

        //now validation for images
       const avatarLocalpath= req.files?.avatar[0]?.path;
       const coverImagelocalPath=req.files?.coverimage[0]?.path;

       if(!avatarLocalpath){
        throw new ApiError(400,"avatar image Required")
       }

       //upload images on cloudry
  const avatar = await uploadImage(avatarLocalpath)
  const coverimage=await uploadImage(coverImagelocalPath)

  if(!avatar){
    throw new ApiError(400,"avatar image Required")
  }
  User.create({
    fullname,
    avatar:avatar.url,
    coverimage:coverimage?.url ||"",
    email,
    password,
    username
  })

    })
// }) 

export {registerUser}