const knex = require("../db/knex");
const PlannedHabitsModel = require("../db/models/plannedHabits");
const plannedHabits = new PlannedHabitsModel(knex);
const HabitsModel = require("../db/models/habits");
const habits = new HabitsModel(knex);
const { NotFoundError, ConflictError } = require("../lib/custom-error");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

class plannedHabitService {
  static async getPlannedHabitById(user_id) {
    try {
      return await knex.transaction(async (trx) => {
        // DB: transaction 객체전달하기
        plannedHabits.setTrx(trx);
        // DB: end_date가 오늘또는 다음날들이고, user_id에 해당하는 데이터 조회
        const plannedHabitArr = await plannedHabits.findUnclosedByUserId(
          user_id
        );
        // if (plannedHabitArr.length === 0)
        //   throw new NotFoundError("현재 실천 중인 습관이 없습니다.");
        return plannedHabitArr;
      });
    } catch (err) {
      throw err;
    }
  }

  static async addPlannedHabit(user_id, habitIds, habitDate) {
    try {
      return await knex.transaction(async (trx) => {
        // DB: transaction 객체전달하기
        plannedHabits.setTrx(trx);
        // 이미 있는 습관의 habit_id 가져오기
        let userHabits = await plannedHabits.findUnclosedByUserId(user_id);
        let userHabitsIds = userHabits.map((h) => h.habit_id);

        // 반복문
        for (let i = 0; i < habitIds.length; i++) {
          // 중복 검증
          if (userHabitsIds.includes(habitIds[i])) {
            continue;
          }
          // 추가할 계획습관 데이터 구성하기
          // const planned_habit_id = uuidv4();
          // start_date에 target_days 더해서 end_date 만들기
          const start_date = dayjs();
          const end_date = start_date.add(habitDate, "day");
          // DB: 새로운 계획습관 데이터 추가하기
          const newhabit = {
            // planned_habit_id,
            user_id,
            habit_id: habitIds[i],
            start_date: start_date.utc(true).format(),
            end_date: end_date.utc(true).format(),
          };
          // DB: 새로운 데이터 추가
          await plannedHabits.create(newhabit);
        }
      });
    } catch (err) {
      throw err;
    }
  }

  static async deletePlannedHabit(user_id, habitIds) {
    try {
      return await knex.transaction(async (trx) => {
        // DB: transaction 객체전달하기
        plannedHabits.setTrx(trx);
        //user_id로 현재 실천 중인 습관하져오기
        const pHabits = await plannedHabits.findUnclosedByUserId(user_id);
        const pHabitsToDelete = pHabits.filter((ph) => {
          for (let habitId of habitIds) {
            if (ph.habit_id === habitId) {
              return true;
            }
          }
          return false;
        });

        // 반복문
        for (let pHabit of pHabitsToDelete) {
          const result = await plannedHabits.deleteById(
            pHabit.planned_habit_id
          );
          if (result === 0) {
            throw new Error("DB 데이터 삭제 실패");
          }
        }
      });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = plannedHabitService;
