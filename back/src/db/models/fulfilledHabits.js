class FulfilledHabitsModel {
  constructor(knex) {
    this.knex = knex;
  }

  async getToday(user_id, today, tomorrow) {
    try {
      return await this.knex
        .select("habit_id")
        .from("fulfilled_habits")
        .where({
          user_id: user_id,
        })
        .where("date", ">=", today)
        .where("date", "<", tomorrow);
    } catch (error) {
      console.error(
        "오늘의 습관 달성 여부를 불러오다가 뭔가 잘못됨",
        error.stack
      );
      throw new Error(error);
    }
  }

  // 일단 month를 통해서 date, title, id 칼럼 조회해서 -> month 쿼리 파라미터 쓸때는 date 만 가져다 사용, date 에서는 요 테이블에서 날짜 필터링..?
  //어느게 더 빠를까?
  async getByMonth(user_id, month, nextMonth) {
    try {
      return await this.knex
        .select("date")
        .from("fulfilled_habits")
        .where({
          user_id: user_id,
        })
        .where("date", ">=", `${month}-01`)
        .where("date", "<", `${nextMonth}-01`);
    } catch (error) {
      console.error("월별 달성 여부 불러오다가 뭔가 잘못됨", error.stack);
      throw new Error(error);
    }
  }

  async getByDate(user_id, date) {
    try {
      return await this.knex
        .select("habits.habit_title")
        .from("fulfilled_habits")
        .join("habits", "fulfilled_habits.habit_id", "=", "habits.habit_id")
        .where("fulfilled_habits.user_id", "=", user_id)
        .andWhere("fulfilled_habits.date", "=", date);
    } catch (error) {
      console.error(
        "요청한 일자의 달성 여부 불러오다가 뭔가 잘못됨",
        error.stack
      );
      throw new Error(error);
    }
  }
  async insertChecked(data) {
    try {
      // 중복 체크 필요!
      await this.knex("fulfilled_habits").insert(data);
      console.log("달성 기록이 잘 저장됨");
    } catch (error) {
      console.error("달성 습관을 저장하다가 뭔가 잘못됨", error.stack);
      throw new Error(error);
    }
    // finally {
    //   await this.knex.destroy();
    // } // 이 코드를 빼야합니다! 이코드가 있으면 데이터 삽입 직후 데이터베이스와의 연결이 끊어져 후속 요청시 연결이 끊어졌다는 오류가 납니다
  }

  async deleteChecked(data) {
    try {
      await this.knex("fulfilled_habits").where(data).del();
      console.log("달성 기록이 잘 삭제됨");
      //delete from fulfilled_habits where user=user_id and date = today and habit_id = habit_id;
    } catch (error) {
      console.error("취소한 달성내역을 삭제하다가 뭔가 잘못됨", error.stack);
      throw new Error(error);
    }
  }
}

module.exports = FulfilledHabitsModel;
