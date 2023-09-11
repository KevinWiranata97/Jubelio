"use strict";
process.env.NODE_ENV = "test";
const request = require("supertest");
const { init } = require("../app"); // Import the init function from app.js

let server; // Declare a variable to store the server instance
let authToken;
let productId; //
beforeAll(async () => {
  const pgp = require("pg-promise")();

  // Define your database connection configuration
  const dbConfig = {
    host: process.env.TEST_DB_HOST,
    port: process.env.TEST_DB_PORT,
    database: process.env.TEST_DB_NAME,
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
  };
  const db = pgp(dbConfig);
  const createProductsTableQuery = `
  CREATE TABLE IF NOT EXISTS
  Products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR NOT NULL,
    SKU VARCHAR NOT NULL UNIQUE,
    image VARCHAR,
    price VARCHAR NOT NULL,
    description VARCHAR,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
  )
`;

  const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
user_name VARCHAR(128) NOT NULL UNIQUE,
password VARCHAR(128) NOT NULL,
email VARCHAR(128) NOT NULL UNIQUE,
createdAt TIMESTAMPTZ DEFAULT NOW(),
updatedAt TIMESTAMPTZ DEFAULT NOW()
)
`;
  try {
    // Execute SQL DROP TABLE statements to delete both "products" and "users" tables
    await db.none(createProductsTableQuery);
    await db.none(createUsersTableQuery);
    console.log('Tables "products" and "users" deleted.');
  } catch (error) {
    console.error("Error deleting tables:", error);
  } finally {
    // Close the database connection
    db.$pool.end();
  }

  server = await init(); // Start the server for testing
  const userData = {
    username: "testuser",
    email: "testuser@example.com",
    password: "password123",
  };

  // Make a POST request to the registration route
  await request(server.listener).post("/register").send(userData);

  const authResponse = await request(server.listener)
    .post("/login") // Replace with your login route
    .send({
      username: "testuser",
      password: "password123",
    });

  authToken = authResponse.body.authorization;

  const productResponse = await request(server.listener)
    .post("/products")
    .set("Authorization", authToken)
    .send({
      product_name: "Product to Delete33",
      description: "Product description44",
      price: 19.99,
      image: "https://example.com/product-image.jpg",
      sku: "delete-sku1124444633",
    });

  productId = productResponse.body.data[0].id;
});

afterAll(async () => {
  // Import your PostgreSQL library (e.g., 'pg-promise' or 'pg')
  const pgp = require("pg-promise")();

  // Define your database connection configuration
  const dbConfig = {
    host: process.env.TEST_DB_HOST,
    port: process.env.TEST_DB_PORT,
    database: process.env.TEST_DB_NAME,
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
  };

  // Create a new database connection using the test database configuration
  const db = pgp(dbConfig);

  try {
    // Execute SQL DROP TABLE statements to delete both "products" and "users" tables
    await db.none("DROP TABLE IF EXISTS products");
    await db.none("DROP TABLE IF EXISTS users");
    console.log('Tables "products" and "users" deleted.');
  } catch (error) {
    console.error("Error deleting tables:", error);
  } finally {
    // Close the database connection
    db.$pool.end();
  }

  await server.stop(); // Stop the server after testing
});

it("should return a 201 status code on successful registration", async () => {
  // Define test user registration data
  const userData = {
    username: "testuser1",
    email: "testuser@example1.com",
    password: "password123",
  };

  // Make a POST request to the registration route
  const response = await request(server.listener)
    .post("/register")
    .send(userData);

  // Assert that the response status code is 201 (Created)
  expect(response.status).toBe(201);

  // You can add more assertions based on your application's behavior
});
it("should return a 400 status code on invalid registration data", async () => {
  // Define invalid user registration data (e.g., missing required fields)
  const invalidUserData = {
    username: "testuser",
    // Missing email and password fields
  };

  // Make a POST request to the registration route with invalid data
  const response = await request(server.listener)
    .post("/register")
    .send(invalidUserData);

  // Assert that the response status code is 400 (Bad Request)
  expect(response.status).toBe(400);

  // You can add more assertions based on your application's validation rules
});

it("should return a 200 status code and an authentication token on successful login", async () => {
  // Define your test user's credentials
  const userCredentials = {
    username: "testuser",
    password: "password123",
  };

  try {
    // Make a POST request to the /login route on the test server
    const response = await request(server.listener)
      .post("/login")
      .send(userCredentials);

    // Check the HTTP response status code
    expect(response.status).toBe(200);

    // You can add additional assertions as needed
  } catch (error) {
    // Log any error details for troubleshooting

    throw error; // Rethrow the error to fail the test
  }
});

it("should return a 401 status code on failed login", async () => {
  // Define your test user's credentials
  const userCredentials = {
    username: "testuser",
    password: "password123xxxx",
  };

  try {
    // Make a POST request to the /login route on the test server
    const response = await request(server.listener)
      .post("/login")
      .send(userCredentials);

    // Check the HTTP response status code
    expect(response.status).toBe(401);

    // You can add additional assertions as needed
  } catch (error) {
    // Log any error details for troubleshooting

    throw error; // Rethrow the error to fail the test
  }
});

it("should return a 200 status code with a valid Authorization header", async () => {
  // Make a GET request to the /products route with the Authorization header
  const response = await request(server.listener)
    .get("/products")
    .set("Authorization", authToken);

  // Assert that the response status code is 200 (OK)
  expect(response.status).toBe(200);

  // You can add more assertions based on your application's behavior
});

it("should return a 401 status code without a valid Authorization header", async () => {
  // Make a GET request to the /products route without the Authorization header
  const response = await request(server.listener).get("/products");

  // Assert that the response status code is 401 (Unauthorized)
  expect(response.status).toBe(401);

  // You can add more assertions based on your application's behavior
});

it("get product by id should return a 200 status code with a valid id & Authorization header", async () => {
  // Make a GET request to the /products route with the Authorization header
  const response = await request(server.listener)
    .get("/products/1")
    .set("Authorization", authToken);

  // Assert that the response status code is 200 (OK)
  expect(response.status).toBe(200);

  // You can add more assertions based on your application's behavior
});

it("get product by id should return a 404 status code with a invalid id & Authorization header", async () => {
  // Make a GET request to the /products route with the Authorization header

  try {
    const response = await request(server.listener)
      .get("/products/143434")
      .set("Authorization", authToken);

    // Assert that the response status code is 200 (OK)
    expect(response.status).toBe(404);
  } catch (error) {
    console.error(error);
  }

  // You can add more assertions based on your application's behavior
});

it("should add a product with a valid Authorization header", async () => {
  // Define the product data you want to add
  const productData = {
    product_name: "New Product",
    description: "Product description",
    price: 19.99,
    image:
      "https://codetesting.jubelio.store/wp-content/uploads/2023/03/gucci-3200-4904083-1.jpg",
    sku: "test-sku1",
  };

  // Make a POST request to the /products route with the Authorization header and product data
  const response = await request(server.listener)
    .post("/products")
    .set("Authorization", authToken)
    .send(productData);

  // Assert that the response status code is 201 (Created) or the appropriate code for successful product creation
  expect(response.status).toBe(201);

  // You can add more assertions based on your application's behavior
});

it("should return a 401 status code without a valid Authorization header", async () => {
  // Define the product data you want to add
  const productData = {
    product_name: "New Product",
    description: "Product description",
    price: 19.99,
    image:
      "https://codetesting.jubelio.store/wp-content/uploads/2023/03/gucci-3200-4904083-1.jpg",
    sku: "test-sku",
  };

  // Make a POST request to the /products route without the Authorization header and product data
  const response = await request(server.listener)
    .post("/products")
    .send(productData);

  console.log(response);
  // Assert that the response status code is 401 (Unauthorized)
  expect(response.status).toBe(401);

  // You can add more assertions based on your application's behavior
});

it("edit product should edit a product with a valid Authorization header", async () => {
  // Define the updated product data

  const updatedProductData = {
    product_name: "Updated Product",
    description: "Updated product description",
    price: 29.99,
    image: "https://new-image-url.com",
    sku: "updated-sku1",
  };

  // Make a PUT request to the /products/:productId route with the Authorization header and updated product data
  const response = await request(server.listener)
    .put(`/products/${productId}`)
    .set("Authorization", authToken)
    .send(updatedProductData);

  // Assert that the response status code is 200 (OK) or the appropriate code for successful product editing
  expect(response.status).toBe(201);

  // You can add more assertions based on your application's behavior
});

it("edit product should return a 401 status code without a valid Authorization header", async () => {
  // Define the updated product data
  const updatedProductData = {
    product_name: "Updated Product",
    description: "Updated product description",
    price: 29.99,
    image: "https://new-image-url.com",
    sku: "updated-sku",
  };

  // Make a PUT request to the /products/:productId route without the Authorization header and updated product data
  const response = await request(server.listener)
    .put(`/products/${productId}`)
    .send(updatedProductData);

  // Assert that the response status code is 401 (Unauthorized)
  expect(response.status).toBe(401);

  // You can add more assertions based on your application's behavior
});

it("should delete a product with a valid Authorization header", async () => {
  // Make a DELETE request to the /products/:productId route with the Authorization header
  const response = await request(server.listener)
    .delete(`/products/${productId}`)
    .set("Authorization", authToken);

  // Assert that the response status code is 204 (No Content) or the appropriate code for successful deletion
  expect(response.status).toBe(201);

  // You can add more assertions based on your application's behavior
});

it("should return a 401 status code without a valid Authorization header", async () => {
  // Make a DELETE request to the /products/:productId route without the Authorization header
  const response = await request(server.listener).delete(
    `/products/${productId}`
  );

  // Assert that the response status code is 401 (Unauthorized)
  expect(response.status).toBe(401);

  // You can add more assertions based on your application's behavior
});
