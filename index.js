// index.js
import 'dotenv/config';
import express from 'express';
import rssRoute from './src/routes/rssRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', rssRoute);
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});