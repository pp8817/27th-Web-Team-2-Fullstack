// 웨딘 API의 PostgreSQL 쿼리와 트랜잭션을 관리한다.
import { Pool, type PoolClient } from 'pg';

import { ApiError } from './http';

let pool: Pool | undefined;

export function db(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new ApiError(503, '데이터베이스가 연결되지 않았습니다.');
    }

    pool = new Pool({
      connectionString,
      max: 3,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 5000,
      allowExitOnIdle: true,
    });
    pool.on('error', () => console.error('PostgreSQL idle connection failed'));
  }

  return pool;
}

export async function transaction<T>(
  work: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await db().connect();
  let discard = false;
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      discard = true;
    }
    throw error;
  } finally {
    client.release(discard);
  }
}
