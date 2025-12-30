const AWS = require('aws-sdk');
const logger = require('../utils/logger');

// AWS Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-south-1'
});

// S3 Instance
const s3 = new AWS.S3();

// S3 Helper Functions
const uploadToS3 = async (file, folder = 'uploads') => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${folder}/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    logger.error('S3 upload error:', error);
    throw new Error('File upload failed');
  }
};

const deleteFromS3 = async (url) => {
  try {
    const key = url.split('.com/')[1];
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };

    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    logger.error('S3 delete error:', error);
    return false;
  }
};

const generatePresignedUrl = async (key, expires = 3600) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: expires
    };

    return await s3.getSignedUrlPromise('getObject', params);
  } catch (error) {
    logger.error('S3 presigned URL error:', error);
    throw error;
  }
};

module.exports = {
  s3,
  uploadToS3,
  deleteFromS3,
  generatePresignedUrl
};