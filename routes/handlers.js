const getAllUsers = async (db) => {
  try {
    // Use the db object to query the database
    const users = await db.any('SELECT * FROM "user"'); // Use double quotes around "user" if it's a reserved keyword

    return users;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching users');
  }
};

const home = () => {
  return 'Hello, Hapi.js!';
};

module.exports = {
  getAllUsers,
  home,
};
