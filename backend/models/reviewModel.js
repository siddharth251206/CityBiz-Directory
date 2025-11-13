// models/reviewModel.js
const db = require('../db');

class Review {
  /**
   * Get all reviews for a business
   */
  static async getByBusiness(businessId) {
    const sql = `
      SELECT 
        r.review_id,
        r.user_id,
        u.name AS user_name,
        r.business_id,
        r.rating,
        r.comment,
        r.created_at
      FROM "Review" r
      JOIN "User" u ON r.user_id = u.user_id
      WHERE r.business_id = $1
      ORDER BY r.created_at DESC
    `;

    const result = await db.query(sql, [businessId]);
    return result.rows;
  }

  /**
   * Create a new review
   */
  static async create({ user_id, business_id, rating, comment }) {
    const sql = `
      INSERT INTO "Review" (user_id, business_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await db.query(sql, [
      user_id,
      business_id,
      rating,
      comment
    ]);

    return result.rows[0];
  }

  /**
   * Update a review (only review owner can update)
   */
  static async update(reviewId, userId, updateData) {
    const { rating, comment } = updateData;

    const sql = `
      UPDATE "Review"
      SET rating = $1,
          comment = $2
      WHERE review_id = $3 AND user_id = $4
      RETURNING *
    `;

    const result = await db.query(sql, [
      rating,
      comment,
      reviewId,
      userId
    ]);

    return result.rows[0];
  }

  /**
   * Delete a review (owner only)
   */
  static async delete(reviewId, userId) {
    await db.query(
      `DELETE FROM "Review" WHERE review_id = $1 AND user_id = $2`,
      [reviewId, userId]
    );

    return { message: 'Review deleted successfully' };
  }

  /**
   * Get review count by user (Optional — uses SQL, not stored function)
   */
  static async getUserReviewCount(userId) {
    const sql = `
      SELECT COUNT(*) AS count
      FROM "Review"
      WHERE user_id = $1
    `;

    const result = await db.query(sql, [userId]);
    return parseInt(result.rows[0].count, 10);
  }

  static async getAllByBusinessId(businessId) {
  const sql = `
    SELECT r.*, u.name AS user_name
    FROM "Review" r
    JOIN "User" u ON r.user_id = u.user_id
    WHERE r.business_id = $1
    ORDER BY r.created_at DESC
  `;
  const result = await db.query(sql, [businessId]);
  return result.rows;
}

static async getByUserId(userId) {
    const sql = `
        SELECT r.*, b.name AS business_name
        FROM "Review" r
        JOIN "Business" b ON r.business_id = b.business_id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
    `;

    const result = await db.query(sql, [userId]);
    return result.rows;
}
}

module.exports = Review;
