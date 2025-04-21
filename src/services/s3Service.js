const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION
});

const bucketName = process.env.S3_BUCKET_NAME;

const saveToS3 = async (fileName, data) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: data,
      ContentType: 'application/json'
    };

    const result = await s3.upload(params).promise();
    console.log(`Arquivo salvo com sucesso: ${result.Location}`);
    return result.Location;
  } catch (error) {
    console.error('Erro ao salvar no S3:', error);
    throw error;
  }
};

const getFileFromS3 = async (fileName) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName
    };

    const data = await s3.getObject(params).promise();
    return data.Body.toString();
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      console.log(`Arquivo ${fileName} não encontrado no bucket. Retornando array vazio.`);
      return null;
    }
    console.error('Erro ao obter arquivo do S3:', error);
    throw error;
  }
};

module.exports = {
  saveToS3,
  getFileFromS3
};
