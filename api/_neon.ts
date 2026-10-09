import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is not configured.');

export const sql = neon(databaseUrl);

export async function ensureNeonSchema() {
  await sql`CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS store_config (id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS store_analytics (id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), total_visits INTEGER NOT NULL DEFAULT 0, unique_visitors INTEGER NOT NULL DEFAULT 0, last_visit_date TEXT NOT NULL DEFAULT '')`;
  await sql`CREATE TABLE IF NOT EXISTS orders (order_id TEXT PRIMARY KEY, data JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS orders_yebeck_reference_idx ON orders ((data->>'yebeckReference'))`;
}
