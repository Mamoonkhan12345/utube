import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret 
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           localFilePath, {
               resource_type:'auto',
           }
       )
       .catch((error) => {
        fs.unlinkSync(localFilePath)
           console.log(error);
       });
    
    console.log(uploadResult);
    
})

export{uploadResult}