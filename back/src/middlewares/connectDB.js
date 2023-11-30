// const pool = require("../db/db");
const knex = require("../db/knexConfig");

// SQL2 라이브러리를 사용해 DB 연결하고 SQL 문 사용하여 데이터 조작
// const connectDB = async (req, res, next) => {
//   console.log("Connecting to the turtineDB...");

//   try {
//     const connection = await pool.getConnection();
//     await connection.query("USE turtine");
//     console.log("Connected to the turtineDB.");
//     req.dbConnection = connection;
//     next();
//   } catch (error) {
//     console.error("Database connection failed: " + error.stack);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

//Knex Query Builder 사용하여 DB 연결
const connectDB = async (req, res, next) => {
  console.log("Connecting to the turtineDB...");
  try {
    await knex.raw("USE turtine"); //mySQL pool.getConnection().query 대신 knex를 이용하여 DB 에 연결합니다.
    console.log("Connected to the turtineDB.");
    req.dbConnection = knex; //req에 knex를 넣어 전달합니다.
    next();
  } catch (error) {
    console.error("Database connection failed: " + error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = connectDB;
