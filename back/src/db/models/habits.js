class HabitsModel {
  constructor(knex) {
    this.knex = knex;
  }

  async create(habit) {
    try {
      return await this.knex("habits").insert(habit);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findById(habit_id) {
    try {
      if (!habit_id) {
        return await this.knex("habits").select("*").from("habits");
      }
      return await this.knex("habits").select("*").where("habit_id", habit_id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(habit_id, toUpdate) {
    try {
      return await this.knex("habits")
        .where("user_id", habit_id)
        .update(toUpdate);
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteById(habit_id) {
    try {
      return await this.knex("habits").where("habit_id", habit_id).delete();
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = HabitsModel;
