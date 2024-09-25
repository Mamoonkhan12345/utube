import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
});

let uploadResult;

async function uploadImage(localFilePath) {
    try {
        // Upload an image
        uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });
        console.log(uploadResult);
        return uploadResult;  // Return the result from the function
    } catch (error) {
        fs.unlinkSync(localFilePath);  // Clean up file if there's an error
        console.error(error);
        throw error;  // Rethrow the error to handle it elsewhere
    }
}

export { uploadImage };  // Export the function, not the result directly
