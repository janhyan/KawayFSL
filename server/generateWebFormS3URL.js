import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const generateWebFormS3URL = async (event) => {
  try {
    let REGION = "<REGION-NAME>";
    let BUCKET = "<BUCKET-NAME>";
    let KEY = event.key;

    const client = new S3Client({ region: REGION });
    const command = new PutObjectCommand({ Bucket: BUCKET, Key: KEY });
    
    const presignedUrl = await getSignedUrl(client, command, { expiresIn: 360 });
    console.log("Presigned URL:", presignedUrl);
    
    return {
      status: "Success",
      message: presignedUrl
    };
  }
  catch (err) {
    console.error(err);
    throw new Error(err);
  }
};