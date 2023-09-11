import { makeAutoObservable, observable, action } from "mobx";
import axios from "axios";
import Swal from "sweetalert2";

export class Store {
  products = [];
  productById = [];
  productRec = [];

  constructor() {
    makeAutoObservable(this, {
      products: observable,
      setProducts: action,
    });
  }

  setProducts(products) {
    this.products = products;
  }

  setProductsById(products) {
    this.productById = products;
  }

  setProductsRec(products) {
    this.productRec = products;
  }

  // fetchProduct() {
  //   const authorizationHeader = `Bearer ${localStorage.getItem(
  //     "authorization"
  //   )}`;

  //   fetch("http://localhost:5000/products", {
  //     method: "GET",
  //     headers: {
  //       Authorization: authorizationHeader,
  //       "Content-Type": "application/json", // You can adjust the content type if needed
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         // Handle the case where the request was not successful (e.g., status code other than 200 OK)
  //         throw new Error(`Request failed with status ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       // Handle the response data as needed
  //       this.setProducts(data);
  //     })
  //     .catch((error) => {
  //       // Handle any errors that occurred during the fetch
  //       console.error("Error:", error);
  //       // You may want to handle the error in a more specific way here
  //     });
  // }
  async fetchProduct() {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/products`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
       
      });
     
      this.setProducts(response.data);

    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(data) {
    try {
      
      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/products`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
        data: data,
      });
     
  

      if(response.status === 201){
        Swal.fire("Good job!", "Data successfully created!", "success");
        this.fetchProduct()
      }
    } catch (error) {
      console.log(error);
    }
  }
  // fetchProductById(id) {
  //   fetch(`http://localhost:3000/products/${id}`)
  //     .then((response) => response.json())
  //     .then((data) => this.setProductsById(data));
  // }


  async fetchProductById(id) {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/products/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
       
      });
  
     
      this.setProductsById(response.data)

    } catch (error) {
      console.log(error);
    }
  }

  async editDetails(payload, id, navigate) {
    try {
    
       const response =await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API_URL}/products/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
        data: payload,
      });

      console.log(response);
      if(response.status === 201){
        Swal.fire("Good job!", "Data successfully edited!", "success");
        this.fetchProduct()
      }

    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please login first",
        });

      
      }
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  }

  async deleteProduct(id, navigate) {
    try {
     const response = await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_API_URL}/products/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

      if(response.status === 201){
        Swal.fire("Good job!", "Data successfully deleted!", "success");
      }
   

     
      this.fetchProduct()
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please login first",
        });

   
      }
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  }
}
