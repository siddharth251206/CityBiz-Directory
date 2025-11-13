// models/businessModel.js
const db = require('../db');

class Business {
  /**
   * Get ALL businesses via stored procedure
   * Matches: sp_get_all_businesses() RETURNS TABLE(...)
   */
  static async getAll() {
    const result = await db.query(`SELECT * FROM sp_get_all_businesses()`);
    return result.rows;
  }

  /**
   * Get single business by ID
   * Matches: sp_get_business_by_id(biz_id int)
   */
  static async getById(id) {
    const result = await db.query(
      `SELECT * FROM sp_get_business_by_id($1)`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Get all approved businesses in a category
   */
  static async getByCategoryId(categoryId) {
    const result = await db.query(
      `
      SELECT b.*, c.name AS category_name
      FROM "Business" b
      JOIN "Category" c ON b.category_id = c.category_id
      WHERE b.category_id = $1 AND b.status = 'approved'
      ORDER BY b.avg_rating DESC
      `,
      [categoryId]
    );
    return result.rows;
  }

  /**
   * Search businesses by name (case-insensitive)
   */
  static async searchByName(name) {
    const result = await db.query(
      `
      SELECT b.*, c.name AS category_name
      FROM "Business" b
      JOIN "Category" c ON b.category_id = c.category_id
      WHERE b.name ILIKE $1 AND b.status = 'approved'
      ORDER BY b.avg_rating DESC
      `,
      [`%${name}%`]
    );
    return result.rows;
  }

  /**
   * Filter by rating range
   */
  static async filterByRating(minRating, maxRating) {
    const result = await db.query(
      `
      SELECT b.*, c.name AS category_name
      FROM "Business" b
      JOIN "Category" c ON b.category_id = c.category_id
      WHERE b.avg_rating >= $1 
      AND b.avg_rating <= $2 
      AND b.status = 'approved'
      ORDER BY b.avg_rating DESC
      `,
      [minRating, maxRating]
    );
    return result.rows;
  }

  /**
   * Get top rated businesses via stored function
   * Matches: sp_get_top_rated_businesses(limit int)
   */
  static async getTopRated(limit = 4) {
    const result = await db.query(
      `SELECT * FROM sp_get_top_rated_businesses($1)`,
      [limit]
    );
    return result.rows;
  }

  /**
   * Create business
   * Uses RETURNING * so structure ALWAYS matches.
   */
  static async create(data) {
    const {
      owner_id,
      category_id,
      name,
      description,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      website = null,
      image
    } = data;

    const result = await db.query(
      `
      INSERT INTO "Business"
      (owner_id, category_id, name, description, address, city, state, pincode, phone, email, website, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
      `,
      [
        owner_id,
        category_id,
        name,
        description,
        address,
        city,
        state,
        pincode,
        phone,
        email,
        website,
        image
      ]
    );

    return result.rows[0];
  }

  /**
   * Update an existing business
   * Merges existing data + new data → avoids undefined fields.
   */
  static async update(id, newData) {
    const existing = await this.getById(id);
    if (!existing) throw new Error("Business not found");

    const data = { ...existing, ...newData };

    const {
      category_id,
      name,
      description,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      website,
      status,
      image
    } = data;

    const result = await db.query(
      `
      UPDATE "Business" 
      SET 
        category_id = $1,
        name = $2,
        description = $3,
        address = $4,
        city = $5,
        state = $6,
        pincode = $7,
        phone = $8,
        email = $9,
        website = $10,
        status = $11,
        image = $12
      WHERE business_id = $13
      RETURNING *
      `,
      [
        category_id,
        name,
        description,
        address,
        city,
        state,
        pincode,
        phone,
        email,
        website,
        status,
        image,
        id
      ]
    );

    return result.rows[0];
  }

  /**
   * Delete business
   */
  static async delete(id) {
    await db.query(`DELETE FROM "Business" WHERE business_id = $1`, [id]);
    return { message: "Business deleted successfully" };
  }

  /**
   * Approve all pending businesses
   * Matches: sp_approve_all_pending_businesses() RETURNS TABLE(...)
   */
  static async approveAllPending() {
    const result = await db.query(
      `SELECT * FROM sp_approve_all_pending_businesses()`
    );

    return result.rows[0];
  }

  /**
   * Find by owner
   */
  static async findByOwner(ownerId) {
    const result = await db.query(
      `
      SELECT 
        b.*, 
        c.name AS category_name,
        (SELECT COUNT(*) FROM "Favorite" f WHERE f.business_id = b.business_id) AS favorite_count,
        (SELECT COUNT(*) FROM "Review" r WHERE r.business_id = b.business_id) AS review_count
      FROM "Business" b
      JOIN "Category" c ON b.category_id = c.category_id
      WHERE b.owner_id = $1
      ORDER BY b.date_added DESC
      `,
      [ownerId]
    );

    return result.rows;
  }

  /**
   * List all pending businesses
   */
  static async findPending() {
    const result = await db.query(
      `
      SELECT 
        b.*, 
        c.name AS category_name,
        (SELECT COUNT(*) FROM "Review" r WHERE r.business_id = b.business_id) AS review_count
      FROM "Business" b
      JOIN "Category" c ON b.category_id = c.category_id
      WHERE b.status = 'pending'
      ORDER BY b.date_added ASC
      `
    );

    return result.rows;
  }
}

module.exports = Business;
