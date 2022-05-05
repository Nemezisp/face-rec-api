const AWS = require("aws-sdk");
const bucketName = "facerec-photos";
const s3 = new AWS.S3({region: 'eu-central-1', 
                       signatureVersion: 'v4',
                       accessKeyId: process.env.AWS_ACCESS_KEY,
                       secretAccessKey: process.env.AWS_SECRET_KEY,
                       apiVersion: '2006-03-01'
                      });
const expirationInSeconds = 120;

const getS3url = async (req, res) => {
    const key = req.query.name;

    const params = {
        Bucket: bucketName,
        Key: key,
        ContentType: "multipart/form-data",
        Expires: expirationInSeconds,
      };

    const preSignedURL = await s3.getSignedUrl('putObject', params);
    res.json({url: preSignedURL})
}

module.exports = {
    getS3url,
}