class PlannedHabitsModel {
  constructor(knex) {
    this.knex = knex;
  }

  setTrx(trx) {
    this.trx = trx;
  }

  async create(plannedHabit) {
    try {
      return this.knex("planned_habits")
        .transacting(this.trx)
        .insert(plannedHabit);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findById(planned_habit_id) {
    try {
      if (!planned_habit_id) {
        return this.knex("planned_habits").transacting(this.trx).select("*");
      }
      return this.knex("planned_habits")
        .transacting(this.trx)
        .select("*")
        .where("planned_habit_id", planned_habit_id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findByUserId(user_id) {
    try {
      return this.knex("planned_habits")
        .transacting(this.trx)
        .select("*")
        .where("user_id", user_id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findUnclosedByUserId(user_id) {
    try {
      const today = new Date();
      return this.knex("planned_habits")
        .transacting(this.trx)
        .select("*")
        .where("user_id", user_id)
        .andWhere("end_date", ">=", today);
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteById(planned_habit_id) {
    try {
      return this.knex("planned_habits")
        .transacting(this.trx)
        .where("planned_habit_id", planned_habit_id)
        .delete();
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = PlannedHabitsModel;
