const db = require('../db');

class Business {
  // Get all businesses (joins with Category for category name)
  static async getAll() {
  // Result from CALL is nested in an array
  const [rows] = await db.query('CALL sp_GetAllBusinesses()');
  return rows[0];
}

  // Get business by ID
  static async getById(id) {
  const [rows] = await db.query('CALL sp_GetBusinessById(?)', [id]);
  return rows[0][0]; // Result from CALL is nested
}

  // Get businesses by category ID
  static async getByCategoryId(categoryId) {
    const sql = `
      SELECT b.*, c.name AS category_name
      FROM Business b
      JOIN Category c ON b.category_id = c.category_id
      WHERE b.category_id = ? AND b.status = 'approved'
      ORDER BY b.avg_rating DESC
    `;
    const [rows] = await db.query(sql, [categoryId]);
    return rows;
  }

  // Search businesses by name
  static async searchByName(name) {
    const sql = `
      SELECT b.*, c.name AS category_name
      FROM Business b
      JOIN Category c ON b.category_id = c.category_id
      WHERE b.name LIKE ? AND b.status = 'approved'
      ORDER BY b.avg_rating DESC
    `;
    const [rows] = await db.query(sql, [`%${name}%`]);
    return rows;
  }

  // Filter by rating range
  static async filterByRating(minRating, maxRating) {
    const sql = `
      SELECT b.*, c.name AS category_name
      FROM Business b
      JOIN Category c ON b.category_id = c.category_id
      WHERE b.avg_rating >= ? AND b.avg_rating <= ? AND b.status = 'approved'
      ORDER BY b.avg_rating DESC
    `;
    // Using <= for maxRating to include 5-star ratings in a 4-5 filter
    const [rows] = await db.query(sql, [minRating, maxRating]);
    return rows;
  }

  // Get top rated businesses
  static async getTopRated(limit = 4) {
  const [rows] = await db.query('CALL sp_GetTopRatedBusinesses(?)', [limit]);
  return rows[0];
}

  // Create new business
  static async create(businessData) {
    // Note: owner_id and category_id must be provided
    const { owner_id, category_id, name, description, address, city, state, pincode, phone, email,website=null, image } = businessData;
    
    const sql = `
      INSERT INTO Business 
      (owner_id, category_id, name, description, address, city, state, pincode, phone, email, website, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(sql, [
      owner_id, category_id, name, description, address, city, state, pincode, phone, email, website, image
    ]);
    
    return this.getById(result.insertId);
  }

  // Update business
  static async update(id, businessData) {
    // Does not allow updating owner_id or avg_rating directly
    const { category_id, name, description, address, city, state, pincode, phone, email, website, status, image } = businessData;
    
    const sql = `
      UPDATE Business SET 
      category_id = ?, name = ?, description = ?, address = ?, city = ?, state = ?, pincode = ?, 
      phone = ?, email = ?, website = ?, status = ?, image = ? 
      WHERE business_id = ?
    `;

    await db.query(sql, [
      category_id, name, description, address, city, state, pincode, phone, email, website, status || 'pending',image, id
    ]);
    
    return this.getById(id);
  }

  // Delete business
  static async delete(id) {
    await db.query('DELETE FROM Business WHERE business_id = ?', [id]);
    return { message: 'Business deleted successfully' };
  }
  // Add this new function to models/businessModel.js
  // Admin function to approve all pending businesses
  static async approveAllPending() {
    const [rows] = await db.query('CALL sp_ApproveAllPendingBusinesses(@count)');
    // The result will be in the final packet
    return rows[rows.length - 1][0]; 
  }
}

module.exports = Business;