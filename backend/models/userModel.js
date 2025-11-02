const db = require('../db');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    const { name, email, password, role, phone } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [rows] = await db.query(
      'CALL sp_RegisterUser(?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'viewer', phone]
    );

    // Check if the procedure returned an error
    if (rows[0][0].ErrorMessage) {
      throw new Error(rows[0][0].ErrorMessage);
    }

    const userId = rows[0][0].user_id;
    return { user_id: userId, name, email, role: role || 'viewer' };
  }

  // Find user by email
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM User WHERE email = ?', [email]);
    return rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await db.query('SELECT user_id, name, email, role, phone, date_joined FROM User WHERE user_id = ?', [id]);
    return rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user
  static async update(id, userData) {
    const { name, email, phone } = userData;
    await db.query('UPDATE User SET name = ?, email = ?, phone = ? WHERE user_id = ?', [name, email, phone, id]);
    return this.findById(id);
  }

  // Delete user
  static async delete(id) {
    await db.query('DELETE FROM User WHERE user_id = ?', [id]);
    return { message: 'User deleted successfully' };
  }
  static async getReviewCount(userId) {
  const [rows] = await db.query('SELECT fn_GetUserReviewCount(?) AS count', [userId]);
  return rows[0].count;
}
}

module.exports = User;