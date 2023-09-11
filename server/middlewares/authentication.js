
const { verifyToken } = require("../helpers/jwt");
const pgp = require("pg-promise")();
require("dotenv").config();

const checkAuthorizationForSpecificAPI = async (request, h,db) => {
  try {
    const isSpecificAPI = request.path.startsWith('/products');
    const { authorization } = request.headers;
    
    if (!authorization && isSpecificAPI) {
      return h.response({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid email or password',
      }).code(401);
    }
    
    if(authorization){
      let decode =verifyToken(authorization)
    
 
    
      const findUser = await db.one(`SELECT * FROM "users" WHERE "id" = ${decode.id}`);
  
      request.userAccess = {
        id: findUser.id,
        email: findUser.email,
        userName: findUser.user_name
      };
  
    }
  
  

    return h.continue;
  } catch (error) {
    if(error.name === "JsonWebTokenError"){
      return h.response({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token',
      }).code(401);
    }
  console.log(error);
  }
 
};

module.exports = checkAuthorizationForSpecificAPI;
