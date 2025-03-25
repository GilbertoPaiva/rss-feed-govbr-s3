# Processamento de Notas Fiscais com IA

Avaliação das segunda e terceira sprints do programa de bolsas Compass UOL para formação em Inteligência Artificial para AWS.

***

## Execução (Código Fonte)

Faça uma API em JavaScript/NodeJS implementada em Docker na AWS para extrair  informações relevantes de um site com conteúdo em formato RSS. Esta aplicação deve salvar os dados em arquivo JSON dentro de um bucket S3, e permitir a consulta do conteúdo salvo através de uma página html.

**Especificações**:

1. Escolher um site de conteúdo público com RSS (como notícias, blogs, etc. e **deve ser diferente das demais equipes**);
2. Desenvolver uma API para extrair parte o conteúdo RSS do site;
3. Salvar o conteúdo extraído em arquivo JSON dentro de um bucket S3;
4. Subir esta API utilizando Docker;
5. Criar uma página html para fazer consultas à API construída em NodeJS (pode ser bem simples, o layout não será avaliado).

* Exemplo de RSS com NodeJS:
  * [Create an RSS Reader in Node](https://sabe.io/tutorials/rss-reader-node)

### Docker

Execução em Docker, dentro da AWS Cloud.

* Subir o projeto NodeJS em Docker na cloud AWS.
* O grupo pode ficar livre quanto à estratégia adotada para executar o Docker na AWS.
* Exemplos de como executar:
  * [Deploy Node js Application on AWS EC2 Server](https://youtu.be/VHzeoDK6L0c?feature=shared)
  * [Docker na AWS: EC2 ou Elastic Beanstalk? O que é melhor?](https://youtu.be/TJSK9MRPZs4?si=FCm_lDQWIVEUAHlj)

***

## O que será avaliado?

* Uso do projeto em NodeJS;
* Solução em Docker;
* Projeto em produção na cloud AWS;
* Seguir as atividades na ordem proposta;
* Subir códigos no git ao longo do desenvolvimento;
* Organização geral do código fonte:
  * Estrutura de pastas;
  * Estrutura da lógica de negócio;
  * Divisão de responsabilidades em arquivos/pastas distintos;
  * Otimização do código fonte (evitar duplicações de código);
* Objetividade do README.md;
* Modelo de organização da equipe para o desenvolvimento do projeto;
* Página criada com acesso online.

***

## Entrega

* **O trabalho deve ser feito em grupos de três ou quatro pessoas**;
* Criar uma branch no repositório com o formato grupo-número (exemplo: grupo-1);
* Conferir se o site de interesse já não foi escolhido por outra equipe;
* Subir o trabalho na branch da equipe com um README.md:
  * documentar detalhes sobre como a avaliação foi desenvolvida;
  * relatar dificuldades conhecidas;
  * descrever como utilizar o sistema;
  * fornecer a URL para acesso à página;
* 🔨 Disponibilizar o código fonte desenvolvido (observar estruturas de pastas);
* Colocar o arquivo com a configuração nginx (se utilizado).

* O prazo de entrega é até às 09h do dia 23/04/2025 no repositório do github (<https://github.com/GilbertoPaiva/rss-feed-govbr-s3>).

***

## Apresentação

* A coordenação do programa de bolsas irá agendar a apresentação das equipes.
* Cada equipe terá 15 minutos para apresentar seu readme, código e demonstração do funcionamento da aplicação.
* Sugere-se que a equipe faça um ensaio prévio utilizando o Teams e testando os recursos de compartilhamento.
* Na apresentação haverá ao menos uma pessoa da equipe do Programa de Bolsas para acompanhamento.
* A apresentação será gravada para que os instrutores possam avaliar posteriormente.
* Os recursos AWS deverão ficar ativos até o final da sprint corrente da apresentação.
* Após assistir a gravação da apresentação haverão instrutores que darão o feedback técnico.
* Após todas as apresentações a coordenação também fornecerá o feedback comportamental.

***
