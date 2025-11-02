const db = require('../db');

class Category {
  // Get all categories
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM Category ORDER BY name');
    return rows;
  }

  // Get a single category by its ID
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM Category WHERE category_id = ?', [id]);
    return rows[0];
  }

  // Create a new category
  static async create(categoryData) {
    const { name, description } = categoryData;
    const [result] = await db.query(
      'INSERT INTO Category (name, description) VALUES (?, ?)',
      [name, description]
    );
    return this.getById(result.insertId);
  }
}

module.exports = Category;