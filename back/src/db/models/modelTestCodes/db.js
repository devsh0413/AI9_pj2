const mysql = require("mysql2");

// Pool 연결
const pool = mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB,
});

// promise pool 생성
const promisePool = pool.promise();

// pool을 이용한 DB 연결 테스트
const testPromisePool = async () => {
  const result = await promisePool.query("SELECT * FROM users");
  console.log("DB Pool connected");
  console.log(`test SELECT * FROM users : ${JSON.stringify(result[0])}`);
};

module.exports = promisePool;
