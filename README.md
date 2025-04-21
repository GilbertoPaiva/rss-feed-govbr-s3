# RSS Feed API - Avaliação das Sprints 2 e 3

Programa de Bolsas Compass UOL / AWS - Turma março/2025

## Descrição do Projeto

API desenvolvida em JavaScript/NodeJS implementada em Docker na AWS para extrair informações de feeds RSS do portal Gov.br. A aplicação salva os dados extraídos em formato JSON em um bucket S3 e permite a consulta do conteúdo através de uma página HTML.

## Funcionalidades

- Extração de conteúdo RSS do portal Gov.br
- Armazenamento dos dados em formato JSON no Amazon S3
- API RESTful para consulta dos dados salvos
- Interface web para visualização das notícias

## Tecnologias Utilizadas

- Node.js
- Express.js
- Docker
- AWS (EC2, S3)
- HTML, CSS e JavaScript

## Estrutura do Projeto

```
├── src/
│   ├── controllers/    # Controladores da aplicação
│   ├── services/       # Serviços de negócio
│   ├── routes/         # Rotas da API
│   └── config/         # Configurações da aplicação
├── public/
│   ├── css/            # Arquivos de estilo
│   ├── js/             # Scripts do cliente
│   └── index.html      # Página principal
├── Dockerfile          # Configuração do Docker
├── docker-compose.yml  # Orquestração de containers
└── package.json        # Dependências do projeto
```

## Como executar

### Pré-requisitos

- Node.js (v14 ou superior)
- Docker e Docker Compose
- Conta na AWS com acesso ao S3

### Configuração

1. Clone o repositório
2. Configure as credenciais da AWS
3. Execute os seguintes comandos:

```bash
# Instalar dependências
npm install

# Executar localmente
npm start

# Executar com Docker
docker-compose up -d
```

## Endpoints da API

- `GET /api/feeds` - Lista todos os feeds salvos
- `GET /api/feeds/:id` - Retorna um feed específico
- `POST /api/refresh` - Atualiza os feeds do RSS

## Acesso à aplicação

- API: http://[endereço-ec2]:3000/api
- Interface web: http://[endereço-ec2]:3000

## Equipe de Desenvolvimento

- [Nome dos integrantes da equipe]

## Licença

Este projeto está sob a licença MIT.

