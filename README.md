# Northcoders News API

1. To use this repo you will need to first run `npm install` to get all the packages.

2. Ensure you create .env files in the root directory of this project

```
.env.test
___________________
PGDATABASE=nc_snacks_test
```

```
.env.development
____________________
PGDATABASE=nc_snacks
```

3. Make sure you create your databases with the command `npm run setup-dbs`

4. To ensure this has worked, you should be able to run `npm test` and have a full suite of passing tests.

5. To run this repo as a development server (for use with insomnia or other request making entities) make sure you seed the dev database with `npm run seed`

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
