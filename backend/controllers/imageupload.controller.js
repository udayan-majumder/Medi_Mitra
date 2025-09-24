import fs from "fs";
import cloudinary from "../config/cloudbinary.config.js";
import { UploadPescriptionToDB } from "../models/user.models.js";


export const uploadFile = async (req, res) => {
  try {
    const fileRoute = req.file.path
    const {profileid,userid} = req.body

    if (!fileRoute) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(fileRoute, {
      folder: "uploads",
    });

    // delete local temp file
    fs.unlinkSync(req.file.path);

    // res.json({
    //   message: "File uploaded successfully",
    //   url: result?.secure_url, // save this in DB later
    // });
     
    //uploading
    const isUploaded = await UploadPescriptionToDB(profileid,userid,result?.secure_url)
    if(!isUploaded){
      return res.status(400).json({upload:false})
    }
    //uploaded
    return res.status(200).json({"message":"successfully added","url":result?.secure_url})
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Upload failed" });
  }
};
