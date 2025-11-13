// models/userModel.js
const db = require('../db');
const bcrypt = require('bcryptjs');

class User {

  // ======================================================
  //  CREATE USER (REGISTER)
  //  Uses PostgreSQL stored function: sp_register_user()
  // ======================================================
  static async register(userData) {
  const { name, email, password, role, phone } = userData;

  const sql = `
    SELECT sp_register_user($1, $2, $3, $4, $5) AS result
  `;

  const result = await db.query(sql, [
    name,
    email,
    password,
    role || "viewer",
    phone
  ]);

  const payload = result.rows[0].result;

  if (!payload.user_id) {
    return {
      user_id: null,
      message: payload.error || payload.message
    };
  }

  return {
    user_id: payload.user_id,
    name,
    email,
    role: role || "viewer",
    phone,
    message: payload.message
  };
}



  // ======================================================
  //  FIND USER BY EMAIL
  // ======================================================
  static async findByEmail(email) {
    const result = await db.query(
      `SELECT * FROM "User" WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }


  // ======================================================
  //  FIND USER BY ID
  // ======================================================
  static async findById(id) {
    const result = await db.query(
      `SELECT user_id, name, email, role, phone, date_joined FROM "User" WHERE user_id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }


  // ======================================================
  //  UPDATE USER
  // ======================================================
  static async update(id, data) {
    const { name, email, phone, password } = data;

    const fields = [];
    const values = [];
    let idx = 1;

    if (name) {
      fields.push(`name = $${idx++}`);
      values.push(name);
    }
    if (email) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }
    if (phone) {
      fields.push(`phone = $${idx++}`);
      values.push(phone);
    }
    if (password) {
      fields.push(`password = $${idx++}`);
      values.push(password);
    }

    values.push(id);

    const sql = `
      UPDATE "User"
      SET ${fields.join(", ")}
      WHERE user_id = $${idx}
      RETURNING user_id, name, email, role, phone, date_joined
    `;

    const result = await db.query(sql, values);
    return result.rows[0] || null;
  }


  // ======================================================
  //  DELETE USER
  // ======================================================
  static async delete(id) {
    await db.query(
      `DELETE FROM "User" WHERE user_id = $1`,
      [id]
    );
    return { message: "User deleted successfully" };
  }


  // ======================================================
  //  REVIEW COUNT (uses stored function)
  // ======================================================
  static async getReviewCount(userId) {
    const result = await db.query(
      `SELECT fn_get_user_review_count($1) AS count`,
      [userId]
    );
    return result.rows[0].count;
  }
}

module.exports = User;
