# Feed RSS do Governo Brasileiro com Armazenamento S3

Este projeto exibe o feed RSS do governo brasileiro e o armazena em um bucket S3. Se o feed RSS não estiver disponível, o sistema utiliza a versão armazenada no bucket.

## Funcionalidades

- Exibição de notícias do feed RSS do portal gov.br
- Armazenamento do feed em bucket S3 como backup
- Interface simples e responsiva
- Fallback automático para cache quando feed online não está disponível

## Requisitos

- Node.js 14.x ou superior
- Conta AWS (opcional, caso não use endpoint público)
- Bucket S3

## Configuração

1. Clone o repositório
2. Instale as dependências:
```
npm install
```

3. Configure o arquivo `.env` com suas credenciais AWS ou endpoint S3 público:
```
# Credenciais da AWS (opcional se usar S3_ENDPOINT público)
AWS_REGION=us-east-1
S3_BUCKET_NAME=seu-bucket-s3
AWS_ACCESS_KEY_ID="sua-access-key"
AWS_SECRET_ACCESS_KEY="sua-secret-key"
AWS_SESSION_TOKEN="seu-token-opcional"

# Endpoint S3 público (use isso em vez das credenciais AWS para acesso público)
S3_ENDPOINT=s3://seu-bucket/caminho/

# Configuração do servidor
PORT=3000

# URLs das fontes RSS
RSS_URL_GOVBR=https://www.gov.br/feed
```

## Execução

Para iniciar o servidor em modo desenvolvimento:
```
npm run dev
```

Para iniciar o servidor em produção:
```
npm start
```

Acesse http://localhost:3000 para visualizar a aplicação.

## Estrutura do Projeto

```
├── public              # Arquivos estáticos (frontend)
│   ├── css             # Estilos CSS
│   ├── js              # JavaScript do frontend
│   └── index.html      # Página principal
├── src
│   ├── services        # Serviços da aplicação
│   │   ├── rssService.js   # Processamento de feeds RSS
│   │   └── s3Service.js    # Interação com AWS S3
│   ├── routes          # Rotas da API
│   │   └── index.js    # Definição das rotas
│   └── index.js        # Ponto de entrada da aplicação
├── .env                # Variáveis de ambiente
├── package.json        # Dependências e scripts
└── README.md           # Documentação
```

## API

- `GET /api/feed` - Obtém o feed RSS atualizado
- `GET /api/cache` - Obtém o feed RSS armazenado no cache S3

## Autores

Este projeto foi desenvolvido por:
- Bárbara Castro
- Raquel Corrêa
- Gilberto Paiva

