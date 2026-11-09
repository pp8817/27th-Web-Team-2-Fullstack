// 요청마다 Supabase 세션을 검증하고 웨딘 사용자와 연결한다.
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import type { PoolClient } from 'pg';

import { db } from '@/server/db';
import { ApiError } from '@/server/http';

export function appOrigin(request: NextRequest) {
  const configured = process.env.APP_ORIGIN || process.env.NEXT_PUBLIC_BASE_URL;
  const url = new URL(configured || request.nextUrl.origin);
  if (
    (configured && url.protocol === 'https:') ||
    (url.protocol === 'http:' &&
      ['localhost', '127.0.0.1'].includes(url.hostname))
  ) {
    return url.origin;
  }
  throw new ApiError(503, '서비스 주소 설정이 필요합니다.');
}

export function sessionCookieOptions(request: NextRequest) {
  return {
    httpOnly: true,
    secure: appOrigin(request).startsWith('https:'),
    sameSite: 'lax' as const,
    path: '/',
  };
}

export async function createAuthClient(request: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new ApiError(503, 'Supabase 로그인 설정이 필요합니다.');
  }
  const jar = await cookies();
  const options = sessionCookieOptions(request);
  return createServerClient(url, key, {
    auth: { experimental: { appendPkceFlowIdToRedirects: true } },
    cookieOptions: {
      ...options,
      name: options.secure ? '__Host-weddin-session' : 'weddin-session',
    },
    cookies: {
      encode: 'tokens-only',
      getAll: () => jar.getAll(),
      setAll: (changes) => {
        for (const { name, value, options } of changes) {
          jar.set(name, value, options);
        }
      },
    },
  });
}

export async function requireAuthUser(client: SupabaseClient) {
  const { data, error } = await client.auth.getUser();
  if (
    error &&
    (error.name === 'AuthRetryableFetchError' || (error.status ?? 0) >= 500)
  ) {
    throw new ApiError(503, '로그인 서비스에 연결할 수 없습니다.');
  }
  if (!data.user || error) {
    throw new ApiError(401, '로그인이 필요합니다.');
  }
  return data.user;
}

export async function requireUser(request: NextRequest) {
  const authUser = await requireAuthUser(await createAuthClient(request));
  const result = await db().query<{ id: string; name: string | null }>(
    'SELECT user_id AS id, name FROM users WHERE supabase_user_id = $1',
    [authUser.id],
  );
  const user = result.rows[0];
  if (!user) throw new ApiError(401, '다시 로그인해 주세요.');
  return user;
}

export async function registerUser(client: PoolClient, user: User) {
  const profile = user.user_metadata;
  const name = [profile.full_name, profile.name, profile.nickname].find(
    (value): value is string =>
      typeof value === 'string' && value.trim().length > 0,
  );
  const result = await client.query<{ id: string }>(
    `INSERT INTO users(supabase_user_id, name) VALUES ($1, $2)
     ON CONFLICT (supabase_user_id) DO UPDATE SET name = COALESCE(users.name, EXCLUDED.name)
     RETURNING user_id AS id`,
    [user.id, (name?.trim() || '웨딘 사용자').slice(0, 100)],
  );
  return result.rows[0].id;
}

export async function logout(request: NextRequest) {
  const client = await createAuthClient(request);
  const { error } = await client.auth.signOut({ scope: 'local' });
  if (error) throw new ApiError(502, '로그아웃에 실패했습니다.');
}
