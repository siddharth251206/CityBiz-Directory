const db = require('../db');

class Review {
  // Create new review and update business rating
  static async create(reviewData) {
  const { user_id, business_id, rating, comment } = reviewData;
  
  const [result] = await db.query(
    'INSERT INTO Review (user_id, business_id, rating, comment) VALUES (?, ?, ?, ?)',
    [user_id, business_id, rating, comment]
  );
  
  // The trigger handles the rating update automatically.
  
  return { review_id: result.insertId, ...reviewData };
}

  // Get reviews for a specific business
  static async getByBusinessId(businessId) {
    const [rows] = await db.query(
      `SELECT r.*, u.name AS user_name 
       FROM Review r 
       JOIN User u ON r.user_id = u.user_id 
       WHERE r.business_id = ? 
       ORDER BY r.created_at DESC`,
      [businessId]
    );
    return rows;
  }

  // Calculate and update the average rating for a business
  // static async updateBusinessRating(businessId) {
  //   const [rows] = await db.query(
  //     'SELECT AVG(rating) as avgRating FROM Review WHERE business_id = ?',
  //     [businessId]
  //   );
    
  //   const avgRating = rows[0]?.avgRating || 0.0;
    
  //   await db.query('UPDATE Business SET avg_rating = ? WHERE business_id = ?', [avgRating.toFixed(1), businessId]);
  // }

  // Delete a review and update business rating
  static async delete(id) {
  // The trigger will automatically handle the rating update
  await db.query('DELETE FROM Review WHERE review_id = ?', [id]);
  return { message: 'Review deleted successfully' };
}
// Get a single review by its ID (for security checks in controller)
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM Review WHERE review_id = ?', [id]);
    return rows[0];
  }
  
}

module.exports = Review;