import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      ...(process.env.AWS_SESSION_TOKEN && {
        sessionToken: process.env.AWS_SESSION_TOKEN
      })
    }
  })
});

// Verificação opcional (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  console.log('Configuração AWS S3:', {
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET_NAME
  });
}