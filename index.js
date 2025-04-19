import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rssRoute from './src/routes/rssRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://seu-dominio.com'] 
    : '*',
  methods: 'GET'
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', rssRoute);
app.use(express.static('public'));

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'online' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});