// models/favoriteModel.js
const db = require('../db');

class Favorite {
  /**
   * Add a business to user's favorites
   */
  static async add(user_id, business_id) {
    const sql = `
      INSERT INTO "Favorite" (user_id, business_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, business_id) DO NOTHING
      RETURNING *
    `;

    const result = await db.query(sql, [user_id, business_id]);
    return result.rows[0] || null; // if already exists, returns null
  }

  /**
   * Remove from favorites
   */
  static async remove(user_id, business_id) {
    await db.query(
      `DELETE FROM "Favorite" WHERE user_id = $1 AND business_id = $2`,
      [user_id, business_id]
    );

    return { message: 'Favorite removed successfully' };
  }

  /**
   * Get all favorites by user
   */
  static async getFavoritesByUser(user_id) {
    const sql = `
      SELECT 
        f.favorite_id,
        b.business_id, b.name, b.city, b.state, b.image, b.avg_rating,
        c.name AS category_name
      FROM "Favorite" f
      JOIN "Business" b ON f.business_id = b.business_id
      JOIN "Category" c ON b.category_id = c.category_id
      WHERE f.user_id = $1
      ORDER BY f.favorite_id DESC
    `;

    const result = await db.query(sql, [user_id]);
    return result.rows;
  }

  /**
   * Check if a favorite exists
   * (Uses database SELECT instead of stored function)
   */
  static async exists(user_id, business_id) {
    const result = await db.query(
      `
      SELECT 1 FROM "Favorite"
      WHERE user_id = $1 AND business_id = $2
      `,
      [user_id, business_id]
    );

    return result.rows.length > 0;
  }
}

module.exports = Favorite;
