const knex = require("../../knex");
const dayjs = require("dayjs");

async function dummy_planned() {
  try {
    const habitIds = [
      "habit1",
      "habit2",
      "habit3",
      "habit4",
      "habit5",
      "habit6",
    ];
    const betweenDays = [2, 4, 6];
    const users = await knex("users")
      .select("user_id")
      .where("email", "like", "%daedo.com");
    console.log(users);

    for (let i = 0; i < 5; i++) {
      let user = users[i].user_id;
      console.log(user);
      let startDate = dayjs("2023-01-01").format();
      while (dayjs(startDate) < dayjs("2023-12-08")) {
        const chance = Math.floor(Math.random() * habitIds.length) + 1;
        console.log(chance);
        let habitArry = [];
        console.log(habitArry);
        for (let j = 0; j < chance; j++) {
          const habitIdIdx = Math.floor(Math.random() * habitIds.length);
          console.log(habitIdIdx);
          console.log(habitIds[habitIdIdx]);
          habitArry = [...habitArry, habitIds[habitIdIdx]];
        }
        console.log("탈출", habitArry);
        const habitSet = new Set([habitArry]);
        console.log(habitSet);
        const newHabitArry = [...habitSet];
        console.log(newHabitArry[0]);
        const bdayidx = Math.floor(Math.random() * 3);
        const bday = betweenDays[bdayidx];
        console.log(bday);
        const endDate = dayjs(startDate).add(bday, "day").format();
        console.log(endDate);
        const insertData = newHabitArry[0].map((habit) => ({
          user_id: user,
          habit_id: habit,
          start_date: startDate,
          end_date: endDate,
        }));
        console.log(insertData);
        await knex("planned_habits").insert(insertData);
        startDate = dayjs(endDate).add(1, "day").format();
        console.log(startDate);
      }
    }
    console.log("끝");
  } catch (error) {
    console.error;
  }
}

async function dummy_fulfilled() {
  try {
    const users = await knex("users")
      .select("user_id")
      .where("email", "like", "%daedo.com");
    console.log(users);
    const startDate = dayjs("2023-01-01").format();
    for (let i = 0; i < 5; i++) {
      let user = users[i].user_id;
      console.log(user);
      let date = startDate;
      while (dayjs(date) < dayjs("2023-12-08")) {
        const plan = await knex("planned_habits")
          .distinct("habit_id")
          .where("user_id", user)
          .andWhere("start_date", "<=", date)
          .andWhere("end_date", ">=", date);

        if (plan.length) {
          console.log(plan);
          const habitidcut = Math.floor(Math.random() * plan.length);
          if (habitidcut == plan.length) {
            const data = plan.map((row) => ({
              user_id: user,
              date: date,
              habit_id: row.habit_id,
            }));
            const exist = data.map(
              async (el) =>
                await knex.select("habit_id").from("fulfilled_habits").where({
                  user_id: el.user_id,
                  habit_id: el.habit_id,
                  date: el.date,
                })
            );
            const insertData = data
              .filter((el) => !exist.some((id) => id.habit_id === el.habit_id))
              .map((row) => ({
                user_id: row.user_id,
                date: row.date,
                habit_id: row.habit_id,
              }));
            await knex("fulfilled_habits").insert(insertData);
          } else {
            const data = plan.slice(0, habitidcut + 1).map((row) => ({
              user_id: user,
              date: date,
              habit_id: row.habit_id,
            }));
            const exist = data.map(
              async (el) =>
                await knex.select("habit_id").from("fulfilled_habits").where({
                  user_id: el.user_id,
                  habit_id: el.habit_id,
                  date: el.date,
                })
            );

            const insertData = data
              .filter((el) => !exist.some((id) => id.habit_id === el.habit_id))
              .map((row) => ({
                user_id: row.user_id,
                date: row.date,
                habit_id: row.habit_id,
              }));
            await knex("fulfilled_habits").insert(insertData);
          }
          const nextday = Math.floor(Math.random() * 7);
          if (nextday < 3) {
            date = dayjs(date).add(1, "day").format("YYYY-MM-DD");
          } else if (nextday < 6) {
            date = dayjs(date).add(2, "day").format("YYYY-MM-DD");
          } else {
            date = dayjs(date).add(3, "day").format("YYYY-MM-DD");
          }
        } else {
          date = dayjs(date).add(1, "day").format("YYYY-MM-DD");
        }
      }
      //    select hbit_id from planned_habits where user_id=user and start_date <= date and end_date >= date
    }
    console.log("끝");
  } catch (error) {
    console.error(error);
  }
}

module.exports = { dummy_fulfilled, dummy_planned };
