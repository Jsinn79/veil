import { config } from '../config/index.js';

/**
 * Database connection via Neon serverless Postgres.
 * Uses @neondatabase/serverless for edge compatibility.
 */
export async function getDb() {
  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(config.databaseUrl);
  return sql;
}

/**
 * Execute a raw SQL query with optional params.
 */
export async function query(sqlQuery: string, params?: unknown[]) {
  const sql = await getDb();
  return sql(sqlQuery, params as any);
}

/**
 * Test database connectivity.
 */
export async function pingDb(): Promise<boolean> {
  try {
    const sql = await getDb();
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}