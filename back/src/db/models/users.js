class UsersModel {
  constructor(knex) {
    this.knex = knex;
  }

  async create(user) {
    try {
      return await this.knex("users").insert(user);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findById(user_id) {
    try {
      if (!user_id) {
        return await this.knex("users").select("*").from("users");
      }
      return await this.knex("users").select("*").where("user_id", user_id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findByEmail(email) {
    try {
      return await this.knex("users").select("*").where("email", email);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findByUsername(username) {
    try {
      return await this.knex("users").select("*").where("username", username);
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(user_id, toUpdate) {
    try {
      return await this.knex("users")
        .where("user_id", user_id)
        .update(toUpdate);
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteById(user_id) {
    try {
      return await this.knex("users").where("user_id", user_id).delete();
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = UsersModel;
