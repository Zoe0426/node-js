
require("dotenv").config();

const{ DB_HOST, DB_USER, DB_PWD, DB_NAME }=process.env;
console.log({ DB_HOST, DB_USER, DB_PWD, DB_NAME });