const knex = require("../../knex");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
async function makeDummyUsers(start, number) {
  const users = [];
  for (let i = start; i <= number; i++) {
    let password = `password${i < 10 ? "0" + i : i}`;
    password = await bcrypt.hash(password, 10);
    const username = `user${i < 10 ? "0" + i : i}`;
    const email = `user${i < 10 ? "0" + i : i}@dummy.com`;
    const newUser = {
      username,
      email,
      password,
    };
    users.push(newUser);
  }
  return users;
}

async function setDummyUserLevel(level, number) {
  for (let i = 1; i <= level; ++i) {
    const count = Math.floor(number * i * 0.1);
    const randomUserId = await knex("users")
      .select("user_id")
      .orderByRaw("RAND()")
      .limit(count);
    const randUserIdArr = randomUserId.map((userId) => userId.user_id);
    console.log(randUserIdArr);
    await knex("users").update("level", i).whereIn("user_id", randUserIdArr);
  }
}

async function addDummyUsers(start, number) {
  const newUsers = await makeDummyUsers(start, number);
  console.log("됨?");
  await knex("users").insert(newUsers);
  setDummyUserLevel(5, number);
  console.log("됐나?");
}

async function addDummyFulfilledH(number) {
  const fHabitArr = [];
  const randomUserIdPakets = await knex("users")
    .select("user_id")
    .where("email", "like", "%daedo.com");
  const randUserIdArr = randomUserIdPakets.map((randUser) => randUser.user_id);
  const userIdx = Math.floor(Math.random() * randUserIdArr.length);
  const habitIdPackets = await knex("habits").select("habit_id");
  const habitIds = habitIdPackets.map((habit) => habit.habit_id);
  for (let i = 0; i < number; i++) {
    const habitIdIdx = Math.floor(Math.random() * habitIds.length);
    const start_date = getRandomDate(dayjs("2023-11-28"), dayjs(new Date()));
    const newFh = {
      user_id: randUserIdArr[userIdx],
      habit_id: habitIds[habitIdIdx],
      date: start_date.utc(true).format(),
    };
    fHabitArr.push(newFh);
  }
  console.log(fHabitArr);
  await knex("fulfilled_habits").insert(fHabitArr);
}

async function addDummyPlannedH(number) {
  const pHabitArr = [];
  const randomUserIdPakets = await knex("users")
    .select("user_id")
    .where("email", "like", "%daedo.com");
  const randUserIdArr = randomUserIdPakets.map((randUser) => randUser.user_id);
  const habitIdPackets = await knex("habits").select("habit_id");
  const habitIds = habitIdPackets.map((habit) => habit.habit_id);
  const habitDates = [3, 5, 7];
  for (let i = 0; i < number; i++) {
    const habitIdIdx = Math.floor(Math.random() * habitIds.length);
    const habitDateIdx = Math.floor(Math.random() * habitDates.length);
    const userIdx = Math.floor(Math.random() * randUserIdArr.length);
    const start_date = getRandomDate(dayjs("2023-11-28"), dayjs(new Date()));
    const end_date = start_date.add(habitDates[habitDateIdx], "day");
    const newFh = {
      user_id: randUserIdArr[userIdx],
      habit_id: habitIds[habitIdIdx],
      start_date: start_date.utc(true).format(),
      end_date: end_date.utc(true).format(),
    };
    pHabitArr.push(newFh);
  }
  console.log(pHabitArr);
  await knex("planned_habits").insert(pHabitArr);
}

function getRandomDate(startDate, endDate) {
  const startMillis = startDate.valueOf();
  const endMillis = endDate.valueOf();
  const randomMillis = startMillis + Math.random() * (endMillis - startMillis);
  return dayjs(randomMillis);
}

module.exports = {
  addDummyUsers,
  setDummyUserLevel,
  addDummyPlannedH,
  addDummyFulfilledH,
};
