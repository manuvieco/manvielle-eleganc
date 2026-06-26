// Modelo de dados para operações de usuário no banco.
const database = require('../config/database');

class UserModel {
  static async findByEmail(email) {
    const result = await database.query(
      `
        select id, name, email, password_hash, created_at
        from users
        where email = $1
      `,
      [String(email).trim().toLowerCase()]
    );

    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await database.query(
      `
        select id, name, email, created_at
        from users
        where id = $1
      `,
      [id]
    );

    return result.rows[0] || null;
  }

  static async create(user) {
    const result = await database.query(
      `
        insert into users (name, email, password_hash)
        values ($1, $2, $3)
        returning id, name, email, created_at
      `,
      [user.name, String(user.email).trim().toLowerCase(), user.passwordHash]
    );

    return result.rows[0];
  }
}

module.exports = UserModel;