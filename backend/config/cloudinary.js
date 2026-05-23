import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

/**
 * Upload un buffer en mémoire vers Cloudinary.
 * Remplace cloudinary.uploader.upload(tempFilePath, ...) qui ne fonctionne pas sur Vercel.
 *
 * @param {Buffer} buffer  - Le buffer du fichier (req.files.xxx.data)
 * @param {object} options - Options Cloudinary (folder, width, crop, etc.)
 * @returns {Promise<object>} result Cloudinary (secure_url, public_id, ...)
 */
export const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(buffer);
  });
};

export default cloudinary;
