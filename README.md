# Simple CRUD API with JWT Authentication

Uma API RESTful construída com NestJS implementando operações CRUD de usuários com autenticação JWT, gerenciamento de transações e tratamento customizado de exceções.

## 🚀 Tecnologias

- **NestJS** - Framework progressivo Node.js para construção de aplicações server-side eficientes e escaláveis
- **TypeScript** - Superset JavaScript com tipagem estática
- **MySQL** - Sistema de gerenciamento de banco de dados relacional
- **JWT** - JSON Web Token para autenticação segura
- **Bcrypt** - Biblioteca para hash de senhas

## 📋 Pré-requisitos

- Node.js >= 20.0.0
- NPM >= 10.0.0
- MySQL Server
- Git

## 🔧 Instalação

1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/Simple-Crud.git
cd Simple-Crud
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto:

```env
PORT=3008
MYSQL_HOST=127.0.0.1
MYSQL_USER=seu_usuario
MYSQL_PASS=sua_senha
MYSQL_SCHEMA=nome_do_banco
PRIVATE_KEY_JWT=sua_chave_secreta_jwt
```

4. Crie o banco de dados MySQL e as tabelas necessárias:

```sql
CREATE DATABASE IF NOT EXISTS nome_do_banco;
USE nome_do_banco;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    firts_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status TINYINT DEFAULT 1,
    dt_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dt_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## ▶️ Executando a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Debug
npm run start:debug
```

A API estará disponível em `http://localhost:3008`

## 🔐 Autenticação

A API utiliza JWT (JSON Web Token) para autenticação. Após o login, inclua o token no header das requisições:

```
Authorization: Bearer seu_token_jwt
```

## 📍 Endpoints da API

### Autenticação

#### Login

```http
POST /auth
```

```json
{
  "username": "usuario",
  "password": "senha123"
}
```

Retorna: Token JWT

#### Criar usuário

```http
POST /auth/create/user
```

```json
{
  "firts_name": "João",
  "last_name": "Silva",
  "username": "joaosilva",
  "password": "senha123"
}
```

### Usuários (Requer Autenticação)

#### Listar todos os usuários

```http
GET /auth/all/users
```

Headers: `Authorization: Bearer token`

#### Buscar usuário por ID

```http
GET /auth/:id
```

Headers: `Authorization: Bearer token`

#### Atualizar usuário

```http
PATCH /auth/:id
```

Headers: `Authorization: Bearer token`

```json
{
  "firts_name": "João",
  "last_name": "Santos"
}
```

#### Desativar usuário

```http
DELETE /auth/delete/user/:id
```

Headers: `Authorization: Bearer token`

#### Ativar usuário

```http
PATCH /auth/active/user/:id
```

Headers: `Authorization: Bearer token`

## 🏗️ Arquitetura

### Estrutura do Projeto

```
src/
├── commun/
│   ├── exceptions/
│   │   ├── custom-exceptions/
│   │   ├── filters/
│   │   └── interceptors/
│   └── helpers/
├── database/
│   ├── database.module.ts
│   └── database.service.ts
├── middleware/
│   ├── authentication/
│   │   └── auth.middleware.ts
│   └── transaction/
│       ├── transaction.middleware.ts
│       └── transaction.service.ts
├── modules/
│   └── auth/
│       ├── dto/
│       ├── interface/
│       ├── auth.controller.ts
│       ├── auth.module.ts
│       ├── auth.repository.ts
│       └── auth.service.ts
├── utils/
│   └── uuid-generator.util.ts
├── app.module.ts
└── main.ts
```

### Recursos Principais

- **Middleware de Autenticação**: Valida tokens JWT em todas as rotas protegidas
- **Middleware de Transação**: Gerencia transações de banco de dados automaticamente
- **Tratamento de Exceções Customizado**: Padroniza respostas de erro da API
- **Interceptor de Resposta**: Formata respostas bem-sucedidas de forma consistente
- **Repository Pattern**: Separa lógica de acesso a dados da lógica de negócios
- **DTOs (Data Transfer Objects)**: Valida e transforma dados de entrada
- **Bcrypt para Senhas**: Hash seguro de senhas com salt

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📊 Scripts Disponíveis

- `npm run build` - Compila o projeto
- `npm run format` - Formata o código com Prettier
- `npm run start` - Inicia a aplicação
- `npm run start:dev` - Inicia em modo desenvolvimento com hot-reload
- `npm run start:debug` - Inicia em modo debug
- `npm run start:prod` - Inicia a aplicação compilada
- `npm run lint` - Executa o linter ESLint
- `npm run test` - Executa testes unitários
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:cov` - Executa testes com cobertura
- `npm run test:e2e` - Executa testes e2e

## 🔒 Segurança

- Senhas são hasheadas usando bcrypt com salt
- Autenticação baseada em JWT com expiração de 2 horas
- Middleware de autenticação protege rotas sensíveis
- Validação de dados de entrada usando class-validator
- Tratamento adequado de erros para evitar vazamento de informações

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

Desenvolvido como parte de um projeto de estudo de NestJS com implementação de autenticação JWT e boas práticas de desenvolvimento.

---

⌨️ com ❤️ por Jonatas
