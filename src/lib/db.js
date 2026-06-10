// lib/db.js
import { Pool } from "pg";

const globalForPool = globalThis;

export const pool =
  globalForPool._pool ||
  new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") globalForPool._pool = pool;

export async function query(text, params) {
  return pool.query(text, params);
}