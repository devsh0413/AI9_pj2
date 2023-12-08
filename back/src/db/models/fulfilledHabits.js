class FulfilledHabitsModel {
  constructor(knex) {
    this.knex = knex;
  }
  setTrx(trx) {
    this.trx = trx;
  }
  async findByMonth(userId, thisMonth, nextMonth) {
    try {
      return await this.knex
        .distinct("date")
        .from("fulfilled_habits")
        .where({
          user_id: userId,
        })
        .andWhere("date", ">=", thisMonth)
        .andWhere("date", "<", nextMonth);
    } catch (error) {
      console.error("월별 달성 여부 불러오다가 뭔가 잘못됨", error.stack);
      throw new Error(
        "요청한 달에 습관을 실천한 날들을 DB에서 불러오던 중 문제가 생겼습니다."
      );
    }
  }

  async findByDateRange(userId, startDate, endDate) {
    try {
      console.log("findByDateRange", userId, startDate, endDate);
      return await this.knex
        .select("date")
        .from("fulfilled_habits")
        .where({
          user_id: userId,
        })
        .whereBetween("date", [startDate, endDate]);
    } catch (error) {
      console.error("주차별 실천 습관 수 불러오다가 뭔가 잘못됨", error.stack);
      throw new Error(
        "요청한 주차에 실천한 습관 수를 DB에서 불러오던 중 문제가 생겼습니다."
      );
    }
  }

  async findByDate(user_id, date) {
    try {
      return await this.knex
        .select("habit_id")
        .from("fulfilled_habits")
        .where({ user_id, date });
    } catch (error) {
      console.error(
        "요청한 일자의 달성 여부 불러오다가 뭔가 잘못됨",
        error.stack
      );
      throw new Error(
        "요청 일자의 실천 습관 목록을 DB에서 불러오던 중 문제가 생겼습니다."
      );
    }
  }

  async findExistingRecords(data) {
    try {
      return await this.knex
        .select("habit_id")
        .from("fulfilled_habits")
        .whereIn("habit_id", data.habit_id)
        .andWhere({ user_id: data.user_id, date: data.date });
    } catch (error) {
      console.error(
        "요청한 데이터를 저장전 중복검사하다가 뭔가 잘못됨",
        error.stack
      );
      throw new Error(
        "실천한 습관을 저장하기 위해 DB를 체크하던 중 문제가 생겼습니다."
      );
    }
  }

  async countByUserId(user_id) {
    try {
      return await this.knex("fulfilled_habits")
        .transacting(this.trx)
        .count("*", { as: "count" })
        .where("user_id", user_id);
    } catch (err) {
      throw err;
    }
  }

  async create(data) {
    try {
      await this.knex("fulfilled_habits").transacting(this.trx).insert(data);
      console.log("실천 기록이 잘 저장됨");
    } catch (error) {
      console.error("실천 습관을 저장하다가 뭔가 잘못됨", error.stack);
      throw new Error("실천한 습관을 DB에 저장하던 중 문제가 생겼습니다.");
    }
  }

  async delete(data) {
    try {
      await this.knex("fulfilled_habits")
        .transacting(this.trx)
        .where(data)
        .del();
      console.log("달성 기록이 잘 삭제됨");
    } catch (error) {
      console.error("취소한 달성내역을 삭제하다가 뭔가 잘못됨", error.stack);
      throw new Error(
        "요청한 습관 실천 내역을 DB에서 삭제하던 중 문제가 생겼습니다."
      );
    }
  }
}

module.exports = FulfilledHabitsModel;
