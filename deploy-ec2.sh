#!/bin/bash

# Script de implantação no EC2
# Este script configura o ambiente e inicia a aplicação no EC2

echo "Iniciando configuração do ambiente..."

# Atualizar sistema
echo "Atualizando o sistema..."
if [ -f /etc/os-release ] && grep -q "Amazon Linux" /etc/os-release; then
  sudo yum update -y
  sudo yum install -y nodejs npm git docker
  sudo systemctl start docker
  sudo systemctl enable docker
  sudo usermod -aG docker $USER
elif [ -f /etc/os-release ] && grep -q "Ubuntu" /etc/os-release; then
  sudo apt update -y
  sudo apt install -y nodejs npm git docker.io
  sudo systemctl start docker
  sudo systemctl enable docker
  sudo usermod -aG docker $USER
else
  echo "Sistema operacional não reconhecido. Por favor, instale Node.js, npm e Docker manualmente."
  exit 1
fi

# Configurar o arquivo .env
echo "Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    # Remover as linhas de credenciais AWS que não serão usadas
    sed -i '/AWS_ACCESS_KEY_ID/d' .env
    sed -i '/AWS_SECRET_ACCESS_KEY/d' .env
    
    # Descomentando a linha S3_ENDPOINT
    sed -i 's/# S3_ENDPOINT/S3_ENDPOINT/' .env
    
    echo "Arquivo .env criado."
    echo "Por favor, edite o arquivo .env e configure corretamente:"
    echo "  - S3_ENDPOINT com o endpoint do seu bucket público"
    echo "  - AWS_S3_BUCKET com o nome do seu bucket"
    echo "  - AWS_REGION com a região do seu bucket"
  else
    echo "Arquivo .env.example não encontrado!"
    exit 1
  fi
else
  echo "Arquivo .env já existe."
fi

# Instalando dependências
echo "Instalando dependências..."
npm install

# Configurando o servidor web
echo "Configurando servidor web (Nginx)..."
if command -v apt &> /dev/null; then
  sudo apt install -y nginx
  
  # Configurar Nginx como proxy reverso
  sudo tee /etc/nginx/sites-available/rss-agregador <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

  sudo ln -sf /etc/nginx/sites-available/rss-agregador /etc/nginx/sites-enabled/
  sudo rm -f /etc/nginx/sites-enabled/default
  sudo nginx -t && sudo systemctl restart nginx
elif command -v yum &> /dev/null; then
  sudo yum install -y nginx
  
  # Configurar Nginx como proxy reverso
  sudo tee /etc/nginx/conf.d/rss-agregador.conf <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

  sudo rm -f /etc/nginx/conf.d/default.conf
  sudo nginx -t && sudo systemctl restart nginx
fi

# Criando serviço systemd para manter aplicação rodando
echo "Configurando serviço systemd..."
sudo tee /etc/systemd/system/rss-agregador.service <<EOF
[Unit]
Description=RSS Agregador Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(which node) src/server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable rss-agregador
sudo systemctl start rss-agregador

echo "======================"
echo "Implantação concluída!"
echo "======================"
echo "Seu agregador RSS está rodando na porta 80 (HTTP)"
echo "Para verificar o status do serviço: sudo systemctl status rss-agregador"
echo "Para ver os logs: sudo journalctl -u rss-agregador -f"