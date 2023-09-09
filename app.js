const Hapi = require('@hapi/hapi');
const routes = require('./routes/index.js');
const pgp = require('pg-promise')();

const dbConfig = {
  host: 'localhost',
  port: 5433,
  database: 'jubelio',
  user: 'postgres',
  password: 'souleater123',
};

const db = pgp(dbConfig);

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
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
