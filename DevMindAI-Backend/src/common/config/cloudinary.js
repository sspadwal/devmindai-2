import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const cloudinaryConnect = cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadBuffer = (buffer) => {
    try{

    
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: "uploaded-images",
            resource_type: "image"
        },
            (error, result) => {
                if (error) {
                    return reject(error)
                }
                resolve(result);
            })
        stream.end(buffer);
    })

}
catch(error){
    console.log(error)
}
}

export const imageTransform = async(object,public_id) => {
   try {
     const imageUrl = await cloudinary.url(public_id, {
        transformation: [{
            effect: `gen_remove:${object}`
        }],
        resource_type: 'image',
    });

    const uploaded = await cloudinary.uploader.upload(imageUrl, {
        folder: "object-removed"
    });
    return imageUrl;
   } catch (error) {
        console.log(error)
   }
}

export const backgroundRemover=async(imageBuffer)=>{
    try{
        return await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: 'background-removal-images',
                resource_type: 'image',
                transformation: [
                    { effect: 'background_removal' }
                ]
            },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Cloudinary upload success:', result.secure_url);
                        resolve(result);
                    }
                }
            );
            uploadStream.end(imageBuffer);
        })
    }
    catch(error){
        console.log(error);
    }
}

export default cloudinary;