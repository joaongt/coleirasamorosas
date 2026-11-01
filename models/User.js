import pool from '../config/db.js';

// Define the User model
export const User = {
  async create(name, email, cpf, tel, password) {
    const [result] = await pool.query(
      'INSERT INTO user (name, email, cpf, tel, password) VALUES (?, ?, ?, ?, ?)',
      [name, email, cpf, tel, password]
    );
    return result.insertId;
  },

  async getByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM user WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  async getById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM user WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async updateAvatar(id, avatar) {
    await pool.query(
      'UPDATE user SET avatar = ? WHERE id = ?',
      [avatar, id]
    );
  }
};
