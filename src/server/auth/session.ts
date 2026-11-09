// 사용자 조회와 세션 토큰 발급, 회전, 로그아웃을 처리한다.
import { createHash, randomBytes } from 'node:crypto';

import type { NextRequest, NextResponse } from 'next/server';
import type { PoolClient } from 'pg';

import { db, transaction } from '@/server/db';
import { ApiError } from '@/server/http';

const accessAge = 30 * 24 * 60 * 60;
const refreshAge = 90 * 24 * 60 * 60;
const accessCookie = 'access_token';
const refreshCookie = 'refresh_token';

type Session = Awaited<ReturnType<typeof issueSession>>;

export function randomToken() {
  return randomBytes(32).toString('base64url');
}

export function cookieOptions(request: NextRequest, maxAge: number) {
  return {
    httpOnly: true,
    secure:
      request.nextUrl.protocol === 'https:' ||
      request.headers.get('x-forwarded-proto') === 'https',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

function storedToken(value: string | undefined) {
  if (value && /^w_[\w-]{43}$/.test(value)) {
    return `h:${createHash('sha256').update(value).digest('base64url')}`;
  }
  return value && /^[\w-]{43}$/.test(value) ? value : null;
}

function requestToken(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  return (
    /^Bearer (\S+)$/i.exec(authorization ?? '')?.[1] ??
    request.cookies.get(accessCookie)?.value
  );
}

export async function requireUser(request: NextRequest) {
  const token = storedToken(requestToken(request));
  if (!token) {
    throw new ApiError(401, '로그인이 필요합니다.');
  }
  const result = await db().query<{ id: string; name: string | null }>(
    `SELECT u.user_id AS id, u.name FROM auth_tokens t JOIN users u ON u.user_id = t.user_id
      WHERE t.token_value = $1 AND t.expires_at > now()`,
    [token],
  );
  if (!result.rows[0]) {
    throw new ApiError(401, '로그인이 필요합니다.');
  }
  return result.rows[0];
}

export async function issueSession(client: PoolClient, userId: string) {
  const accessToken = `w_${randomToken()}`;
  const refreshToken = `w_${randomToken()}`;
  const accessTokenExpiresAt = new Date(
    Date.now() + accessAge * 1000,
  ).toISOString();
  const refreshTokenExpiresAt = new Date(
    Date.now() + refreshAge * 1000,
  ).toISOString();
  await client.query(
    'INSERT INTO auth_tokens(token_value, user_id, expires_at) VALUES ($1, $2, $3)',
    [storedToken(accessToken), userId, accessTokenExpiresAt],
  );
  await client.query(
    'INSERT INTO refresh_tokens(token_value, user_id, expires_at) VALUES ($1, $2, $3)',
    [storedToken(refreshToken), userId, refreshTokenExpiresAt],
  );
  return {
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
  };
}

export function setSessionCookies(
  request: NextRequest,
  response: NextResponse,
  session: Session,
) {
  response.cookies.set(
    accessCookie,
    session.accessToken,
    cookieOptions(request, accessAge),
  );
  response.cookies.set(
    refreshCookie,
    session.refreshToken,
    cookieOptions(request, refreshAge),
  );
}

export async function rotateSession(
  request: NextRequest,
  value = request.cookies.get(refreshCookie)?.value,
) {
  const refreshToken = storedToken(value);
  if (!refreshToken) {
    throw new ApiError(401, '세션이 만료되었습니다.');
  }
  return transaction(async (client) => {
    const result = await client.query<{ user_id: string }>(
      `UPDATE refresh_tokens SET used = true WHERE token_value = $1
        AND NOT used AND expires_at > now() RETURNING user_id`,
      [refreshToken],
    );
    if (!result.rows[0]) {
      throw new ApiError(401, '세션이 만료되었습니다.');
    }
    await client.query(
      'DELETE FROM auth_tokens WHERE token_value = $1 AND user_id = $2',
      [storedToken(requestToken(request)), result.rows[0].user_id],
    );
    return issueSession(client, result.rows[0].user_id);
  });
}

export async function logout(request: NextRequest, response: NextResponse) {
  const access = storedToken(requestToken(request));
  const refresh = storedToken(request.cookies.get(refreshCookie)?.value);
  if (access || refresh) {
    await transaction(async (client) => {
      await client.query('DELETE FROM auth_tokens WHERE token_value = $1', [
        access,
      ]);
      await client.query('DELETE FROM refresh_tokens WHERE token_value = $1', [
        refresh,
      ]);
    });
  }
  response.cookies.set(accessCookie, '', cookieOptions(request, 0));
  response.cookies.set(refreshCookie, '', cookieOptions(request, 0));
  return response;
}
