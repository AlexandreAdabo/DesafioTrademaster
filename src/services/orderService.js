const db = require('../config/database');

async function createOrder({ customer_name, total }) {
  const result = await db.query(
    'INSERT INTO orders (customer_name, total) VALUES ($1, $2) RETURNING *',
    [customer_name, total]
  );
  return result.rows[0];
}

module.exports = { createOrder };
