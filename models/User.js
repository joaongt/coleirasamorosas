import mysql2 from 'mysql2/promise';

// Create a connection pool to the MySQL server
// const pool = await mysql2.createConnection
const pool = mysql2.createPool({
  host: 'aws.connect.psdb.cloud',
  user: '4k0ga9x5tjjuxazxy4e5',
  password: 'pscale_pw_XwDRFyarrnOkK11wOkXthPvLFBZdXoLhHoayIWJWyaa',
  database: 'primeiro',
  ssl: {
    rejectUnauthorized: true
  }
});

// Define the User model
export const User = {
  async create(name, email, cpf, tel, password) {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(
        'INSERT INTO user (name, email, cpf, tel, password) VALUES (?, ?, ?, ?, ?)',
        [name, email, cpf, tel, password]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  },
  async getByEmail(email) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        'SELECT * FROM user WHERE email = ?',
        [email]
      );
      return rows[0];
    } finally {
      conn.release();
    }
  },

  async getById(id) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        'SELECT * FROM user WHERE id = ?',
        [id]
      );
      return rows[0];
    } finally {
      conn.release();
    }
  }
};