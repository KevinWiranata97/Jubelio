const Hapi = require('@hapi/hapi');
const routes = require('./routes/index.js');
const checkAuthorizationForSpecificAPI = require('./middlewares/authentication.js');
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
const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});


server.ext('onPreResponse', (request, h) => {
  return checkAuthorizationForSpecificAPI(request, h,db);
});

const init = async () => {

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
