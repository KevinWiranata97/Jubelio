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
    return h.response({
      message:'User registered successfully',
      data:[]
    }).code(201);
  } catch (error) {
    if(error.message === 'duplicate key value violates unique constraint "users_user_name_key"'){
   
      return h.response({
        message:'User already registered',
        data:[]
      }).code(400);
    }else{
      return h.response({
        message:"error registering user"
      }).code(400);
    }
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
          name:findUser.user_name,
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
      return h.response({
        message:'Invalid username or password',
       
        data:[]
      }).code(404);
    }
  } catch (error) {
    console.error(error);
    return h.response('Internal server error').code(500);
  }
};

const getAllProducts = async (db) => {
  try {
    // Use the db object to query the database
    const products = await db.any('SELECT * FROM "products" ORDER BY id ASC');
// Use double quotes around "user" if it's a reserved keyword

    return products;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching users");
  }
};

const getOneProducts = async (request,h,db) => {
  try {
    const id = request.params.id;

    const result = await db.query(
      `SELECT * FROM Products Where id = '${id}'`
    );

    if(result.length < 1) {
      return h.response({
        statusCode: 404,
        error: 'not found',
        message: `Product  with id ${id} not found`,
      }).code(401)
    }
    return result
  } catch (error) {
    console.log(error);
  }
};


const addProducts = async (request,h,db) => {
  try {
    const { product_name, image, sku, price, description } =
    request.payload;

   const result = await db.query(`INSERT INTO Products(product_name, image, SKU, price, description)
    values ('${product_name}', '${image}', '${sku}', '${price}', '${description}')`);

    const find = await db.query(
      `SELECT * FROM Products Where sku = '${sku}'`
    );

    return h.response({
      message:'success add product',
      data:find
    }).code(201);
  } catch (error) {
   
    if(error.message === 'duplicate key value violates unique constraint "products_sku_key"'){
   
      return h.response({
        message:'duplicate sku on new product',
        data:[]
      }).code(400);
    }else{
      console.error(error.message)
    }
  }
};

const editProducts = async (request,h,db) => {
  try {
    const id = request.params.id;
    const { product_name, image, sku, price, description } =
    request.payload;
    const findProduct = await db.query(
      `SELECT * FROM Products Where id = '${id}'`
    );
    if (findProduct.length === 0) {
      return h.response({
        statusCode: 404,
        error: 'not found',
        message: `Product  with id ${id} not found`,
      }).code(401)
    }

    await db.query(
      `UPDATE Products SET product_name = '${product_name}', image = '${image}', sku = '${sku}', price = '${price}', description = '${description}' WHERE id = '${id}'`
    );


    return h.response({
      message:'successfuily updated product',
      data:[]
    }).code(201);
  } catch (error) {
    console.log(error);
    if(error.message === 'duplicate key value violates unique constraint "products_sku_key"'){
   
      return h.response({
        message:'duplicate sku on new product',
        data:[]
      }).code(400);
    }
  }
};

const deleteProducts = async (request,h,db) => {
  try {
    const id = request.params.id;

    const findProduct = await db.query(
      `SELECT * FROM Products Where id = '${id}'`
    );
    if (findProduct.length === 0) {
      return h.response({
        statusCode: 404,
        error: 'not found',
        message: `Product  with id ${id} not found`,
      }).code(401)
    }

    await db.query(`DELETE FROM Products WHERE id = '${id}'`);


    return h.response({
      message:'successfuily deleted product',
      data:[]
    }).code(201);
  } catch (error) {
    console.log(error);
    if(error.message === 'duplicate key value violates unique constraint "products_sku_key"'){
   
      return h.response({
        message:'duplicate sku on new product',
        data:[]
      }).code(400);
    }
  }
};
module.exports = {
  getAllUsers,
  getAllProducts,
  getOneProducts,
  registerUser,
  editProducts,
  deleteProducts,
  login,
  addProducts
};
