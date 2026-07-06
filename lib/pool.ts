import { Pool } from 'pg';

export function postgresPool(): Pool | null {
  const connString = process.env.DATABASE_URL;
  if (!connString) return null;

  const globalForPool = globalThis as typeof globalThis & {
    stormyyPool?: Pool;
  };

  if (globalForPool.stormyyPool) return globalForPool.stormyyPool;

  const pool = new Pool({
    connectionString: connString,
    max: 1,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });

  globalForPool.stormyyPool = pool;
  return pool;
}
