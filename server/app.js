const Hapi = require('@hapi/hapi');
const routes = require('./routes/index.js');
const checkAuthorizationForSpecificAPI = require('./middlewares/authentication.js');
const pgp = require('pg-promise')();
require('dotenv').config()
const HapiCors = require('hapi-cors');
const dbConfig = {
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
  user: process.env.user,
  password: process.env.password,
};

const db = pgp(dbConfig);
const server = Hapi.server({
  port: 5000,
  host: 'localhost',
  routes: {
    cors: true,
  },
});


server.ext('onPreResponse', (request, h) => {
  return checkAuthorizationForSpecificAPI(request, h,db);
});

const init = async () => {
  await server.register({
    plugin: HapiCors,
    options: {
      origins: ['http://localhost:3000'], // Replace with your React app's URL
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the HTTP methods you want to allow credentials: true, // Allow credentials (e.g., cookies) to be sent with requests
    },
  });
  // Register routes and pass the db object
  server.route(routes(db));

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();

module.exports = {
  db,
};
