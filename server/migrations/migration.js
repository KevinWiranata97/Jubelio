const pgp = require('pg-promise')();
require('dotenv').config()
const dbConfig = {
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
  user: process.env.user,
  password: process.env.password,
};


const db = pgp(dbConfig);

async function createTables() {
  try {
    // Define SQL queries for creating the "products" and "users" tables
    const createProductsTableQuery = `CREATE TABLE IF NOT EXISTS
    Products(
      id SERIAL PRIMARY KEY,
      product_name VARCHAR NOT NULL,
      SKU VARCHAR NOT NULL UNIQUE,
      image VARCHAR,
      price VARCHAR NOT NULL,
      description VARCHAR
    )`;;
    

    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id serial PRIMARY KEY,
        user_name VARCHAR(128) NOT NULL UNIQUE,
        password VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL UNIQUE
      );
    `;

    // Execute the queries
    await db.none(createProductsTableQuery);
    await db.none(createUsersTableQuery);

    console.log('Tables "products" and "users" created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    pgp.end(); // Close the database connection
  }
}

// Call the function to create the tables
createTables();
