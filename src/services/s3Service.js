const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const CACHE_FILE_KEY = process.env.CACHE_FILE_KEY || 'rss-gov/rss-data.json';

const s3Config = {
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN
};

if (process.env.S3_ENDPOINT) {
  s3Config.endpoint = process.env.S3_ENDPOINT;
  s3Config.s3ForcePathStyle = true;
}

const s3 = new AWS.S3(s3Config);

async function testS3Connection() {
  try {
    console.log('Testando conexão com o bucket S3...');
    console.log(`Configurações: Bucket=${BUCKET_NAME}, Region=${s3Config.region}`);
    
    if (s3Config.endpoint) {
      console.log(`Usando endpoint personalizado: ${s3Config.endpoint}`);
    }
    
    const result = await s3.listObjectsV2({ Bucket: BUCKET_NAME, MaxKeys: 1 }).promise();
    
    console.log('Conexão com S3 estabelecida com sucesso!');
    console.log(`Objetos encontrados: ${result.Contents ? result.Contents.length : 0}`);
    
    return { success: true, message: 'Conexão com S3 estabelecida' };
  } catch (error) {
    console.error('ERRO DE CONEXÃO COM S3:', error);
    
    let diagnosticMessage = 'Falha na conexão com S3: ';
    
    if (error.code === 'ExpiredToken') {
      diagnosticMessage += 'O token de sessão expirou. Atualize as credenciais AWS.';
    } else if (error.code === 'NoSuchBucket') {
      diagnosticMessage += `O bucket '${BUCKET_NAME}' não existe ou você não tem acesso a ele.`;
    } else if (error.code === 'AccessDenied') {
      diagnosticMessage += 'Acesso negado. Verifique as permissões das credenciais.';
    } else if (error.code === 'CredentialsError') {
      diagnosticMessage += 'Credenciais AWS inválidas ou não fornecidas.';
    } else {
      diagnosticMessage += `${error.code || 'Erro desconhecido'}: ${error.message}`;
    }
    
    return { success: false, message: diagnosticMessage, error };
  }
}

async function saveToS3(key, data) {
  try {
    console.log(`Salvando no S3: bucket=${BUCKET_NAME}, key=${key}`);
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(data),
      ContentType: 'application/json'
    };

    const result = await s3.putObject(params).promise();
    console.log(`Arquivo ${key} salvo com sucesso no S3`);
    return result;
  } catch (error) {
    console.error(`Erro ao salvar no S3: ${error}`);
    
    await testS3Connection();
    throw error;
  }
}

async function getFileFromS3(key) {
  try {
    console.log(`Buscando do S3: bucket=${BUCKET_NAME}, key=${key}`);
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString('utf-8'));
  } catch (error) {
    console.error(`Erro ao recuperar arquivo ${key} do S3: ${error}`);
    
    if (error.code === 'NoSuchKey') {
      console.warn(`O arquivo ${key} não foi encontrado no bucket.`);
    } else {
      await testS3Connection();
    }
    
    throw error;
  }
}

async function listFilesFromS3() {
  try {
    const params = {
      Bucket: BUCKET_NAME
    };

    const data = await s3.listObjectsV2(params).promise();
    return data.Contents ? data.Contents.map(item => item.Key) : [];
  } catch (error) {
    console.error(`Erro ao listar arquivos do S3: ${error}`);
    throw error;
  }
}

testS3Connection().catch(err => {
  console.error('Falha no teste inicial de conexão com S3:', err);
});

module.exports = {
  saveToS3,
  getFileFromS3,
  listFilesFromS3,
  testS3Connection
};
