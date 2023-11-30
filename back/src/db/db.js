require("dotenv").config();
const mysql = require("mysql2");

console.log(`Server Port: ${process.env.SERVER_PORT}`);

// mySQL 커넥션을 생성합니다
const pool = mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
});

//async-await 구조를 사용할 수 있도록 promise pool 을 생성합니다.
const promisePool = pool.promise();

module.exports = promisePool;
