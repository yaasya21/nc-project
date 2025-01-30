# Northcoders News API

1. Prerequisites:
   Node.js: Version 16.0.0 or higher
   PostgreSQL: Version 8.7.3 or higher

2. Clone the Repository: https://github.com/yaasya21/nc-project.git

3. To use this repo you will need to first run `npm install` to get all the packages.

4. Ensure you create .env files in the root directory of this project

```
.env.test
___________________
PGDATABASE=<your_test_database_name_here>
```

```
.env.development
____________________
PGDATABASE=<your_database_name_here>
```

5. Make sure you create your databases with the command `npm run setup-dbs`

6. To ensure this has worked, you should be able to run `npm test` and have a full suite of passing tests.

7. To run this repo as a development server (for use with insomnia or other request making entities) make sure you seed the dev database with `npm run seed`

---

This Node.js project implements a RESTful API for managing news articles. It was created as part of a Digital Skills Bootcamp in Software Engineering by Northcoders (https://northcoders.com/).

You can access the hosted API here: [https://nc-project-iwre.onrender.com/api]
