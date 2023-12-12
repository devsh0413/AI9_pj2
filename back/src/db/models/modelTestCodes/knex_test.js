const knex = require("../../knex");
//test kenx
const testKnex = async () => {
  // const userArr = [
  //   {
  //     user_id: "def492",
  //     username: "insertest1",
  //     email: "insertest1@example.com",
  //     password: "passwordtemp",
  //     level: 4,
  //   },
  //   {
  //     user_id: "def494",
  //     username: "insertest2",
  //     email: "insertest1@example.com",
  //     password: "passwordtemp",
  //     level: 4,
  //   },
  // ];
  // const result = await knex("users").insert(userArr);
  const result = await knex.raw("SHOW TABLES");
  if (result.length > 0) {
    console.log("Knex Successfully connected");
  }
  return;
};

module.exports = testKnex;
