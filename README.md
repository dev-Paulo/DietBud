<div align="center">
  <img 
    alt="Logo Explorer" 
    title="Explorer" 
    src="https://i.imgur.com/jgM1K5Z.png"
  >

  <br>

  <h2 align="center">
    API REST using NodeJS
  </h2>
</div>
<br>

# DAILY DIET API
This API was developed as a challenge from the Node.js Rocketseat Course, after creating a user, a cookie is stored on the request with 7 days to expire. The user can create meals, edit and delete aswell. The user can see a summary of how many meals were created and how many of those were inside his diet or outside.

Topics covered: `ESModule`, `Typescript`, `ESLint`, `Database - Knex, migrations, querys`,`Environment variables`,`Data validation - ZOD`, `Fastify - Plugins, cookies and prehandlers`

## Installation

```bash
# Clone the repo
  git clone https://github.com/dev-Paulo/DietBud.git

# Install project dependencies
  npm install

# Run the project in development mode
  npm run dev
  
# Run the project migrations to create the database
  npm run knex -- migrate:latest
```
## Rules of the application
  - [x] It should be possible to create a user
  - [x] The user should be identifiable across requests
  - [x] It should be possible to register a meal with the following information:  
      - Name
      - Description
      - Date and Time
      - Whether it is within the diet or not
  - [x] It should be possible to edit a meal, allowing changes to all the above data
  - [x] It should be possible to delete a meal
  - [x] It should be possible to list all meals from a user
  - [x] It should be possible to view a single meal
  - [x] It should be possible to retrieve metrics of a user, including:
        - Total number of registered meals
        - Total number of meals within the diet
        - Total number of meals outside the diet
        - Best sequence per day of meals within the diet
  - [x] The user can only view, edit, and delete meals they've created

## Routes
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
