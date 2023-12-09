const knex = require("../../knex");
const dayjs = require("dayjs");

async function dummy_fulfilled(number) {
  try {
    const userCount = await knex("users").count("user_id as count");
    const userLimit = userCount[0].count > number ? number : userCount[0].count;
    console.log("user 몇개: ", userLimit);
    let count = 0;
    const randomUserIdPakets = await knex("users")
      .select("user_id")
      .orderByRaw("RAND()")
      .limit(userLimit);
    console.log(randomUserIdPakets);
    const startDate = dayjs("2023-08-15").format("YYYY-MM-DD");
    for (let i = 0; i < userLimit; i++) {
      let user = randomUserIdPakets[i].user_id;
      console.log(user);
      let date = startDate;
      for (let j = 0; j < 115; j++) {
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
            count += 6;
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
            count += habitidcut;
          }
          const nextday = Math.floor(Math.random() * 7);
          if (nextday < 3) {
            date = dayjs(date).add(1, "day").format("YYYY-MM-DD");
          } else if (nextday < 6) {
            date = dayjs(date).add(3, "day").format("YYYY-MM-DD");
          } else {
            date = dayjs(date).add(5, "day").format("YYYY-MM-DD");
          }
        } else {
          date = dayjs(date).add(2, "day").format("YYYY-MM-DD");
        }
        if (count == number) break;
      }
      if (count == number) break;
      //    select hbit_id from planned_habits where user_id=user and start_date <= date and end_date >= date
    }
    console.log(count);
  } catch (error) {
    console.error(error);
  }
}

module.exports = dummy_fulfilled;
