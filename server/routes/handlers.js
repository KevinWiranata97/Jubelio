const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

const getAllUsers = async (db) => {
  try {
    // Use the db object to query the database
    const users = await db.any('SELECT * FROM "users"'); // Use double quotes around "user" if it's a reserved keyword

    return users;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching users");
  }
};


const registerUser = async (request, h, db) => {
  try {
    const { username, password, email } = request.payload; // Assuming your request body has these fields

    // Perform database operations or any other logic here
    const hash = hashPassword(password);

    await db.query(`INSERT INTO Users(user_name, password, email)
    VALUES ('${username}', '${hash}', '${email}')`);
    // Return a response
    return h.response("User registered successfully").code(200);
  } catch (error) {
    console.error(error);
    return h.response("Error registering user").code(500);
  }
};


const login = async (request, h, db) => {
  try {
    const { username, password } = request.payload; // Assuming your request body has these fields

    // Define the SQL query to select the user by username
    const findUserQuery = `
      SELECT * FROM users
      WHERE user_name = $1
    `;

    // Execute the SQL query with the username as a parameter
    const findUser = await db.oneOrNone(findUserQuery, [username]);


    if (findUser) { 
       const checkPassword = comparePassword(password, findUser.password);
      // User found, you can check the password and perform authentication logic here
      if (checkPassword) {

        const payload = {
          id: findUser.id,
          username:findUser.user_name,
          email: findUser.email,
          password: findUser.password,
    
        };
        const authorization = generateToken(payload);

        return h.response({
          message:'User login successful',
          authorization:authorization,
          data:[]
        }).code(200);
      } else {
        // Password is incorrect, return an error response
        return h.response({
          message:'Invalid username or password',
          data:[]
        }).code(401);
      }
    } else {
      // User not found, return an error response
      return h.response('User not found').code(404);
    }
  } catch (error) {
    console.error(error);
    return h.response('Internal server error').code(500);
  }
};

const getAllProducts = async (db) => {
  try {
    // Use the db object to query the database
    const products = await db.any('SELECT * FROM "products"'); // Use double quotes around "user" if it's a reserved keyword

    return products;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching users");
  }
};

const getOneProducts = async (db) => {
  try {
    const id = request.params.id;
    const result = await db.query(
      `SELECT * FROM Products Where id = '${id}'`
    );
    return h.response(result[0]).code(200);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getAllUsers,
  getAllProducts,
  getOneProducts,
  registerUser,
  login
};
