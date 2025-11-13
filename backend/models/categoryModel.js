// models/categoryModel.js
const db = require('../db');

class Category {
  /**
   * Get all categories
   */
  static async getAll() {
    const result = await db.query(`SELECT * FROM "Category" ORDER BY category_id ASC`);
    return result.rows;
  }

  /**
   * Create new category
   * PostgreSQL compatible
   */
  static async create(categoryData) {
    const { name, description } = categoryData;

    const result = await db.query(
      `
      INSERT INTO "Category" (name, description)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name, description]
    );

    return result.rows[0];
  }

  /**
   * Get category by ID
   */
  static async getById(id) {
    const result = await db.query(
      `SELECT * FROM "Category" WHERE category_id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Update category
   */
  static async update(id, data) {
    const existing = await this.getById(id);
    if (!existing) throw new Error('Category not found');

    const finalData = { ...existing, ...data };

    const { name, description } = finalData;

    const result = await db.query(
      `
      UPDATE "Category"
      SET name = $1, description = $2
      WHERE category_id = $3
      RETURNING *
      `,
      [name, description, id]
    );

    return result.rows[0];
  }

  /**
   * Delete a category
   */
  static async delete(id) {
    await db.query(
      `DELETE FROM "Category" WHERE category_id = $1`,
      [id]
    );
    return { message: 'Category deleted successfully' };
  }
}

module.exports = Category;
