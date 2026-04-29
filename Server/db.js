import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

console.log("DATABASE_URL:", process.env.DATABASE_URL); // 👈 debug

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Test connection immediately
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL");

    const res = await client.query("SELECT NOW()");
    console.log("🕒 DB Time:", res.rows[0]);

    client.release();
  } catch (err) {
    console.error("❌ DB CONNECTION FAILED:", err);
  }
})();
