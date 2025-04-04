import { S3Client } from '@aws-sdk/client-s3';

let s3ClientConfig = {
  region: process.env.AWS_REGION
};

if (process.env.NODE_ENV === 'production') {
  s3ClientConfig = {
    region: process.env.AWS_REGION
  };
} else {
  
  s3ClientConfig = {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN
    }
  };
}

export const s3Client = new S3Client(s3ClientConfig);

