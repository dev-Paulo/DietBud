<div align="center">
  <img 
    alt="Logo Explorer" 
    title="Explorer" 
    src="https://i.imgur.com/jgM1K5Z.png"
  >

  <br>

  <h2 align="center">
    API REST utilizando NodeJS
  </h2>
</div>
<br>

# DAILY DIET API
This API was developed as a challenge from the Node.js Rocketseat Course, after creating a user, a cookie is stored on the request with 7 days to expire. The user can create meals, edit and delete aswell. The user can see a summary of how many meals were created and how many of those were inside his diet or outside.

Tópicos abordados: `ESModule`, `Typescript`, `ESLint`, `Banco de dados - Knex, migrations, querys`,`Variáveis de ambiente`,`Validação de dados - ZOD`, `Fastify - Plugins, cookies e prehandlers`

## Regras da aplicação

  - [x] Deve ser possível criar um usuário
  - [x] Deve ser possível identificar o usuário entre as requisições
  - [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:  
      - Nome
      - Descrição
      - Data e Hora
      - Está dentro ou não da dieta
  - [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
  - [x] Deve ser possível apagar uma refeição
  - [x] Deve ser possível listar todas as refeições de um usuário
  - [x] Deve ser possível visualizar uma única refeição
  - [x] Deve ser possível recuperar as métricas de um usuário
      - Quantidade total de refeições registradas
      - Quantidade total de refeições dentro da dieta
      - Quantidade total de refeições fora da dieta
      - Melhor sequência por dia de refeições dentro da dieta
  - [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou


## Instalação

```bash
# Faça o clone do repositório
  git clone https://github.com/dev-Paulo/DietBud.git

# Instalar as dependências do projeto
  npm install

# Executando o projeto no ambiente de desenvolvimento
  npm run dev
  
# Rodar as migrations do projeto para criar o banco de dados
  npm run knex -- migrate:latest
```

## Rotas
- Create a new user
```bash
POST /users/create
```

- Create a new meal
```bash
POST /meals/:${user_id}/create
```

- Get all meals created by a user
```bash
GET /meals/user/:${user_id}
```

- Get a specific meal
```bash
GET /meals/:${meal_id}
```

- Show a summary of meals from the user (total of meals, meals inside and outside of the diet)
```bash
GET /meals/summary/:${user_id}
```

- Delete a meal
```bash
DELETE /meals/:${user_id}/:${meal_id}
```

- Edit a meal
```bash
PUT /meals/:${user_id}/:${meal_id}
```
