const handlers = require('./handlers.js'); // Import the handler module

module.exports = (db) => [
  {
    method: 'GET',
    path: '/users',
    handler: async (request, h) => {
      try {
        // Use the handler.getAllUsers function to fetch data
        const users = await handlers.getAllUsers(db);
        return users;
      } catch (error) {
        console.error(error);
        return h.response('Error fetching users').code(500);
      }
    },
  },
  // Other routes
];
