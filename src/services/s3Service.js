const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const usePublicEndpoint = process.env.S3_ENDPOINT ? true : false;

let s3;

if (usePublicEndpoint) {
  const endpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);
  s3 = new AWS.S3({
    endpoint: endpoint,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    region: process.env.AWS_REGION || 'us-east-1'
  });
} else {
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
  });
}

const bucketName = process.env.AWS_S3_BUCKET;

async function saveToS3(key, data) {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: 'application/json'
  };

  try {
    const result = await s3.putObject(params).promise();
    console.log(`Arquivo ${key} salvo com sucesso no S3`);
    return result;
  } catch (error) {
    console.error(`Erro ao salvar no S3: ${error}`);
    throw error;
  }
}

async function getFileFromS3(key) {
  const params = {
    Bucket: bucketName,
    Key: key
  };

  try {
    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString());
  } catch (error) {
    console.error(`Erro ao recuperar arquivo ${key} do S3: ${error}`);
    throw error;
  }
}

async function listFilesFromS3() {
  const params = {
    Bucket: bucketName
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    return data.Contents.map(item => item.Key);
  } catch (error) {
    console.error(`Erro ao listar arquivos do S3: ${error}`);
    throw error;
  }
}

module.exports = {
  saveToS3,
  getFileFromS3,
  listFilesFromS3
};
