const knex = require("../../knex");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
async function makeDummyUsers(start, number) {
  const users = [];
  for (let i = start; i <= start + number; i++) {
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
  console.log("newusers", newUsers);
  await knex("users").insert(newUsers);
  setDummyUserLevel(5, number);
}

async function addDummyFulfilledH(number) {
  try {
    const fHabitArr = [];

    const plannedHabits = await knex("planned_habits")
      .select("*")
      .orderByRaw("RAND()")
      .limit(Math.floor(number / 5));
    const habitDates = [3, 5, 7];
    let count = number;
    while (count > 0) {
      const randPhIdx = Math.floor(Math.random() * plannedHabits.length);
      const randPh = plannedHabits[randPhIdx];
      const habitDateIdx = Math.floor(Math.random() * habitDates.length);
      const randHabitDate = Math.floor(
        Math.random() * habitDates[habitDateIdx] + 1
      );
      console.log("randhabiDate", randHabitDate);
      for (let i = 1; i <= randHabitDate; ++i) {
        const newFh = {
          user_id: randPh.user_id,
          habit_id: randPh.habit_id,
          date: dayjs(randPh.start_date).add(1, "day").utc(true).format(),
        };
        console.log(newFh);
        fHabitArr.push(newFh);
        --count;
      }
    }
    console.log("fHabitArr", fHabitArr);
    await knex("fulfilled_habits")
      .insert(fHabitArr)
      .then((res) => {
        console.log(res, `${number} fulfilled habit datas have been created`);
      });
  } catch (err) {
    throw err;
  }
}

async function addDummyPlannedH(number) {
  try {
    const pHabitArr = [];
    // get habitIds
    const habitIdPackets = await knex("habits").select("habit_id");
    const habitIds = habitIdPackets.map((habit) => habit.habit_id);
    const habitDates = [3, 5, 7];
    let usersCount = await knex("users").count("*", { as: "count" });
    usersCount = usersCount[0].count;
    let count = number;
    let userIds = await knex("users")
      .select("user_id")
      .orderByRaw("RAND()")
      .limit(100);
    userIds = userIds.map((userId) => userId.user_id);
    console.log(userIds);
    while (count > 0) {
      // make rand userIdIdx
      const userIdIdx = Math.floor(Math.random() * userIds.length);
      // make rand habitId array
      const habitIdCount = Math.floor(Math.random() * habitIds.length);
      const shuffled = habitIds.sort(() => 0.5 - Math.random());
      let selectedHabitIds = shuffled.slice(0, habitIdCount);
      // get rand habitDate
      const habitDateIdx = Math.floor(Math.random() * habitDates.length);
      const start_date = getRandomDate(dayjs("2023-08-15"), dayjs(new Date()));
      const end_date = start_date.add(habitDates[habitDateIdx], "day");

      for (let habitId of selectedHabitIds) {
        const newFh = {
          user_id: userIds[userIdIdx],
          habit_id: habitId,
          start_date: start_date.utc(true).format(),
          end_date: end_date.utc(true).format(),
        };
        pHabitArr.push(newFh);
        --count;
        if (count <= 0) {
          break;
        }
      }
    }
    await knex("planned_habits")
      .insert(pHabitArr)
      .then((res) => {
        console.log(res, `${number} planned habit datas have been created`);
      });
  } catch (err) {
    throw err;
  }
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
