const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'myapp_dev',
    format: async (req, file) => {
      const format = file.mimetype.split('/')[1];
      return format;
    },
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'myapp_dev',
//       format: ['jpg', 'png', 'jpeg']
//     },
//   });

  module.exports = {cloudinary,storage}