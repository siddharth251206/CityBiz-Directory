const db = require('../db');

class Favorite {
  // Add a business to a user's favorites
  static async create(favoriteData) {
    const { user_id, business_id } = favoriteData;
    const [result] = await db.query(
      'INSERT INTO Favorite (user_id, business_id) VALUES (?, ?)',
      [user_id, business_id]
    );
    return { favorite_id: result.insertId, ...favoriteData };
  }

  // Get all favorite businesses for a specific user
  static async getByUserId(userId) {
    const sql = `
      SELECT f.favorite_id, b.* FROM Favorite f
      JOIN Business b ON f.business_id = b.business_id
      WHERE f.user_id = ?
    `;
    const [rows] = await db.query(sql, [userId]);
    return rows;
  }
  // Get a single favorite entry by its ID
static async getById(favoriteId) {
    const [rows] = await db.query('SELECT * FROM Favorite WHERE favorite_id = ?', [favoriteId]);
    return rows[0];
  }
  // Remove a business from a user's favorites
  static async delete(favoriteId) {
    await db.query('DELETE FROM Favorite WHERE favorite_id = ?', [favoriteId]);
    return { message: 'Favorite removed successfully' };
  }
  static async isFavorited(userId, businessId) {
  const [rows] = await db.query('SELECT fn_CheckIfFavorited(?, ?) AS favorited', [userId, businessId]);
  return rows[0].favorited; // Will return 1 (true) or 0 (false)
}
}

module.exports = Favorite;