// sample user
const user_temp = {
  user_id: "def490",
  username: "temp",
  email: "temp@gmail.com",
  password: "passwordtemp",
  level: 3,
};

const user_temp_toUpdate = {
  user_id: "def490",
  username: "temp_updated",
  email: "temp@gmail.com",
  password: "passwordtemp",
  level: 4,
};

//test UserMVP
// test create
async function testUserMVP_create(_knex, user) {
  const users = new UsersModel(_knex);
  const result = await users.create(user, ["user_id", "username", "email"]);
  console.log("testUserMVP_create");
  console.log(result);
}

async function testUserMVP_update(_knex, user) {
  const users = new UsersModel(_knex);
  const result = await users.update(user, ["user_id", "username", "email"]);
  console.log("testUserMVP_update");
  console.log(result);
}

async function testUserMVP_delete(_knex, user_id) {
  const users = new UsersModel(_knex);
  const result = await users.deleteById(user_id, [
    "user_id",
    "username",
    "email",
  ]);
  console.log("testUserMVP_delete");
  console.log(result);
}

// testUserMVP_create(knex, user_temp);
testUserMVP_update(knex, user_temp_toUpdate);
// testUserMVP_delete(knex, user_temp.user_id);
