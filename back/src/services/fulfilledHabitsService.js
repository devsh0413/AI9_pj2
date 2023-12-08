const knex = require("../db/knex.js");
const FulfilledHabitsModel = require("../db/models/fulfilledHabits");
const fulfilled = new FulfilledHabitsModel(knex);
const dayjs = require("dayjs");
const weekOfYear = require("dayjs/plugin/weekOfYear.js");
dayjs.extend(weekOfYear);

class fulfilledHabitsService {
  static async getCountsByWeeks(userId) {
    try {
      const today = dayjs(); //오늘
      const thisSat = today.endOf("week");
      const Sun4WsAgo = thisSat.startOf("week").subtract(4, "week");
      const dates = await fulfilled.findByDateRange(
        userId,
        Sun4WsAgo.format("YYYY-MM-DD"),
        thisSat.format("YYYY-MM-DD")
      );
      const weeks = dates.map((date) => {
        return dayjs(date.date).week();
      });
      let weeksCount = {};
      for (let i = Sun4WsAgo.week(); i <= thisSat.week(); ++i) {
        weeksCount[i] = 0;
      }
      weeks.map((week) => {
        const temp = weeksCount[week];
        weeksCount[week] = temp + 1;
      });
      const values = Object.values(weeksCount);
      let result = {};
      let startDate = Sun4WsAgo;
      values.map((val) => {
        let key = `${startDate.format("MM/DD")}~`;
        startDate = startDate.add(6, "day");
        key = key + `${startDate.format("MM/DD")}`;
        result[key] = val;
        startDate = startDate.add(1, "day");
      });

      return result;
    } catch (error) {
      console.error(error.stack);
      throw error;
    }
  }

  static async getDatesByMonth(userId, month) {
    try {
      //다음달 계산
      const nextMonth =
        dayjs(month).month() === 11 // 쿼리로 들어온 달이 12월이면
          ? dayjs(month).add(1, "year").startOf("year").format() //다음 해 01월
          : dayjs(month).add(1, "month").startOf("month").format(); // 아니면 같은 해 다음달
      //이번달 첫날
      const thisMonth = dayjs(month).startOf("month").format();
      //이번달에 습관 실천할 날짜들 조회
      const resultMonth = await fulfilled.findByMonth(
        userId,
        thisMonth,
        nextMonth
      );

      return resultMonth.map((el) => dayjs(el.date).format("YYYY-MM-DD"));
    } catch (error) {
      console.error(error.stack);
      throw error;
    }
  }

  static async getHabitsByDate(userId, date) {
    try {
      const result = await fulfilled.findByDate(userId, date);
      console.log(result);
      return result.map((row) => row.habit_id);
    } catch (error) {
      console.error(error.stack);
      throw error;
    }
  }

  static async getHabitsByToday(userId) {
    try {
      const today = dayjs().format();

      console.log(today);
      const result = await fulfilled.findByDate(userId, today);
      console.log(result);
      return result.map((row) => row.habit_id);
    } catch (error) {
      console.error(error.stack);
      throw error;
    }
  }

  static async addFulfilledHabits(userId, checked) {
    try {
      return await knex.transaction(async (trx) => {
        fulfilled.setTrx(trx);
        //{"fulfilledHabits": ["habit1","habit2","habit4"]}

        const today = dayjs().format();
        console.log(today);
        const data4check = {
          user_id: userId,
          date: today,
          habit_id: checked.fulfilledHabits,
        };

        const exist = await fulfilled.findExistingRecords(data4check);
        console.log("중복 습관id", exist);
        const data = checked.fulfilledHabits
          .filter((el) => !exist.some((id) => id.habit_id === el))
          .map((id) => ({
            user_id: userId,
            date: today,
            habit_id: id,
          }));

        console.log("저장할 습관id", data);
        if (data.length) {
          await fulfilled.create(data);
        } else {
          console.log("오늘 새로 기록할 습관이 없습니다.");
        }
      });
    } catch (error) {
      console.error(error.stack);
      // await trx.rollback();
      throw error;
    }
  }

  static async deleteFulfilledHabits(userId, habitIdArray) {
    try {
      return await knex.transaction(async (trx) => {
        fulfilled.setTrx(trx);
        const today = dayjs().format();
        await Promise.all(
          habitIdArray.map(async (el) => {
            const data = { user_id: userId, habit_id: el, date: today };
            await fulfilled.delete(data);
          })
        );
      });
    } catch (error) {
      console.error(error.stack);
      // await trx.rollback();
      throw error;
    }
  }
}
module.exports = fulfilledHabitsService;
