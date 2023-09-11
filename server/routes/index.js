const handlers = require("./handlers.js"); // Import the handler module

module.exports = (db) => [
  {
    method: "POST",
    path: "/register",
    handler: async (request, h) => {
      try {
        // Use the handler.getAllUsers function to fetch data
        const register = await handlers.registerUser(request, h, db);

        return register;
      } catch (error) {
        console.error(error);
      }
    },
  },

  {
    method: "POST",
    path: "/login",
    handler: async (request, h) => {
      try {
        // Use the handler.getAllUsers function to fetch data
        const login = await handlers.login(request, h, db);

        return login;
      } catch (error) {
        console.error(error);
      }
    },
  },

  {
    method: "GET",
    path: "/products",

    handler: async (request, h) => {
      try {
        const products = await handlers.getAllProducts(request,h,db);
        return products;
      } catch (error) {
        console.error(error);
        return h.response("Error fetching products").code(500);
      }
    },
  },
  {
    method: "GET",
    path: "/products/{id}",

    handler: async (request, h) => {
      try {
   

        const products = await handlers.getOneProducts(request,h,db);
        return products;
      } catch (error) {
        console.log(error);
        console.error(error);
        return h.response("Error fetching products").code(500);
      }
    },
  },
  {
    method: "POST",
    path: "/products",

    handler: async (request, h) => {
      try {


        const products = await handlers.addProducts(request,h,db);
   
        return products
      } catch (error) {
       
        console.error(error);
        return h.response("Error fetching products").code(500);
      }
    },
  },
  {
    method: "PUT",
    path: "/products/{id}",

    handler: async (request, h) => {
      try {
   

        const products = await handlers.editProducts(request,h,db);
        return products;
      } catch (error) {
       
        console.error(error);
        return h.response("Error fetching products").code(500);
      }
    },
  },
  {
    method: "DELETE",
    path: "/products/{id}",

    handler: async (request, h) => {
      try {
   

        const products = await handlers.deleteProducts(request,h,db);
        return products;
      } catch (error) {
       
        console.error(error);
        return h.response("Error fetching products").code(500);
      }
    },
  },
  // Other routes
];
