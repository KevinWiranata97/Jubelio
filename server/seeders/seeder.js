const axios = require("axios");
const pgp = require("pg-promise")();
require("dotenv").config();
const dbConfig = {
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
  user: process.env.user,
  password: process.env.password,
};

const db = pgp(dbConfig);

const consumer_key = "ck_1cbb2c1902d56b629cd9a555cc032c4b478b26ce";
const consumer_secret = "cs_7be10f0328c5b1d6a1a3077165b226af71d8b9dc";
async function fetchReportStat() {
  try {
    // Encode the Consumer Key and Consumer Secret as a base64 string
    const base64Credentials = Buffer.from(
      `${consumer_key}:${consumer_secret}`
    ).toString("base64");

    const response = await axios({
      method: "GET",
      url: "https://codetesting.jubelio.store/wp-json/wc/v3/products/", // Make sure to include the full URL
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  try {
    const dataProducts = await fetchReportStat();
    let data = dataProducts.map((el) => {
      let string = `('${el.name}', '${el.images[0].src}', '${el.sku}', '${el.price}', '${el.description}')`;
      return string;
    });

    const createProduct = `INSERT INTO Products(product_name, image, SKU, price, description) values ${data}`;
    await db.none(createProduct);

    console.log('Data inserted into the "Products" table successfully.');
  } catch (error) {
    console.error(error);
  }
}

main();
