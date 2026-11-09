// OAuth 시작과 콜백을 브라우저 세션에 묶고 웨딘 계정으로 연결한다.
import { createHash } from 'node:crypto';

import { NextRequest, NextResponse } from 'next/server';
import type { PoolClient } from 'pg';
import { z } from 'zod';

import { db, transaction } from '@/server/db';
import { ApiError, noStore } from '@/server/http';

import {
  credentials,
  type Provider,
  providerProfile,
  providers,
  type ProviderToken,
  providerToken,
} from './providers';
import {
  cookieOptions,
  issueSession,
  randomToken,
  requireUser,
  setSessionCookies,
} from './session';

const oauthState = z.object({
  nonce: z.string(),
  verifier: z.string(),
  target: z.enum(['list', 'create', 'mypage', 'account']),
  linkUserId: z.string().optional(),
});

function origin(request: NextRequest) {
  const configured = process.env.APP_ORIGIN || process.env.NEXT_PUBLIC_BASE_URL;
  if (configured) {
    const url = new URL(configured);
    if (
      url.protocol === 'https:' ||
      (url.protocol === 'http:' &&
        ['localhost', '127.0.0.1'].includes(url.hostname))
    ) {
      return url.origin;
    }
  }
  if (
    !configured &&
    ['localhost', '127.0.0.1'].includes(request.nextUrl.hostname)
  ) {
    return request.nextUrl.origin;
  }
  throw new ApiError(503, '서비스 주소 설정이 필요합니다.');
}

function stateCookie(provider: Provider, site: string) {
  return `${site.startsWith('https:') ? '__Host-' : ''}weddin_oauth_${provider}`;
}

function callbackUrl(site: string, provider: Provider) {
  return `${site}/api/v1/auth/oauth/${provider}`;
}

export async function beginOAuth(request: NextRequest, provider: Provider) {
  const site = origin(request);
  const { clientId } = credentials(provider);
  const requestedTarget = request.nextUrl.searchParams.get('target') ?? 'list';
  const linkUserId =
    requestedTarget === 'account' ? (await requireUser(request)).id : undefined;
  const state = oauthState.parse({
    nonce: randomToken(),
    verifier: randomToken(),
    target: requestedTarget,
    linkUserId,
  });
  const url = new URL(providers[provider].authorize);
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl(site, provider),
    response_type: 'code',
    scope:
      provider === 'kakao'
        ? process.env.KAKAO_SCOPE || providers.kakao.scope
        : providers.google.scope,
    state: state.nonce,
  }).toString();
  if (provider === 'google') {
    url.searchParams.set(
      'code_challenge',
      createHash('sha256').update(state.verifier).digest('base64url'),
    );
    url.searchParams.set('code_challenge_method', 'S256');
    if (linkUserId) url.searchParams.set('prompt', 'select_account');
  }
  const response = NextResponse.redirect(url, { headers: noStore });
  response.cookies.set(
    stateCookie(provider, site),
    Buffer.from(JSON.stringify(state)).toString('base64url'),
    { ...cookieOptions(request, 600), secure: site.startsWith('https:') },
  );
  return response;
}

export async function completeOAuth(request: NextRequest, provider: Provider) {
  const site = origin(request);
  const name = stateCookie(provider, site);
  const options = {
    ...cookieOptions(request, 0),
    secure: site.startsWith('https:'),
  };
  try {
    const cookie = request.cookies.get(name)?.value;
    const code = request.nextUrl.searchParams.get('code');
    if (!cookie || !code)
      throw new ApiError(400, '소셜 인증 요청이 만료되었습니다.');
    const state = oauthState.parse(
      JSON.parse(Buffer.from(cookie, 'base64url').toString()),
    );
    if (state.nonce !== request.nextUrl.searchParams.get('state')) {
      throw new ApiError(400, '소셜 인증 요청을 확인할 수 없습니다.');
    }
    if (
      state.linkUserId &&
      (await requireUser(request)).id !== state.linkUserId
    ) {
      throw new ApiError(403, '계정 연동 요청을 확인할 수 없습니다.');
    }

    const parameters: Record<string, string> = {
      grant_type: 'authorization_code',
      redirect_uri: callbackUrl(site, provider),
      code,
    };
    if (provider === 'google') parameters.code_verifier = state.verifier;
    const token = await providerToken(provider, parameters);
    const profile = await providerProfile(provider, token.access_token);
    const providerName = provider.toUpperCase();

    const session = await transaction(async (client) => {
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `${provider}:${profile.id}`,
      ]);
      const account = await client.query<{ user_id: string | null }>(
        'SELECT user_id FROM social_logins WHERE social_provider = $1 AND social_id = $2 AND user_id IS NOT NULL',
        [providerName, profile.id],
      );
      const existingUser = account.rows[0]?.user_id;
      if (
        state.linkUserId &&
        existingUser &&
        existingUser !== state.linkUserId
      ) {
        throw new ApiError(409, '다른 계정에 연결된 소셜 계정입니다.');
      }
      let userId = existingUser ?? state.linkUserId;
      if (userId && state.linkUserId) {
        await client.query(
          'SELECT user_id FROM users WHERE user_id = $1 FOR UPDATE',
          [userId],
        );
        const linked = await client.query(
          'SELECT 1 FROM social_logins WHERE user_id = $1 AND social_provider = $2 AND social_id <> $3',
          [userId, providerName, profile.id],
        );
        if (linked.rowCount)
          throw new ApiError(409, '이미 같은 종류의 계정이 연결되어 있습니다.');
      }
      if (!userId) {
        const user = await client.query<{ user_id: string }>(
          'INSERT INTO users(name) VALUES ($1) RETURNING user_id',
          [
            (
              profile.name ||
              (provider === 'google' ? 'Google 사용자' : '카카오 사용자')
            ).slice(0, 100),
          ],
        );
        userId = user.rows[0].user_id;
      }
      if (!existingUser) {
        await client.query(
          `INSERT INTO social_logins(user_id, social_provider, social_id, email, name, profile_image_url)
            VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            userId,
            providerName,
            profile.id,
            profile.email?.slice(0, 255),
            profile.name?.slice(0, 100),
            profile.image?.slice(0, 512),
          ],
        );
      }
      if (provider === 'kakao') await saveKakaoToken(client, userId, token);
      return state.linkUserId ? null : issueSession(client, userId);
    });

    const target =
      state.target === 'account'
        ? '/mypage/account'
        : `/auth/callback?state=${state.target}`;
    const response = NextResponse.redirect(new URL(target, site), {
      headers: noStore,
    });
    response.cookies.set(name, '', options);
    if (session) setSessionCookies(request, response, session);
    return response;
  } catch (error) {
    console.error(
      'Weddin OAuth failed',
      provider,
      error instanceof Error ? error.name : '',
    );
    const response = NextResponse.redirect(new URL('/auth/failure', site), {
      headers: noStore,
    });
    response.cookies.set(name, '', options);
    return response;
  }
}

export async function saveKakaoToken(
  client: PoolClient,
  userId: string,
  token: ProviderToken,
) {
  await client.query(
    `INSERT INTO social_oauth_tokens(user_id, provider, access_token, refresh_token,
      access_token_expires_at, refresh_token_expires_at, scope)
      VALUES ($1, 'KAKAO', $2, $3, $4, $5, $6)
      ON CONFLICT(user_id, provider) DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token = COALESCE(EXCLUDED.refresh_token, social_oauth_tokens.refresh_token),
        access_token_expires_at = EXCLUDED.access_token_expires_at,
        refresh_token_expires_at = COALESCE(EXCLUDED.refresh_token_expires_at, social_oauth_tokens.refresh_token_expires_at),
        scope = COALESCE(EXCLUDED.scope, social_oauth_tokens.scope)`,
    [
      userId,
      token.access_token,
      token.refresh_token,
      new Date(Date.now() + token.expires_in * 1000),
      token.refresh_token_expires_in
        ? new Date(Date.now() + token.refresh_token_expires_in * 1000)
        : null,
      token.scope,
    ],
  );
}

export async function socialAccounts(userId: string) {
  const result = await db().query<{
    provider: 'KAKAO' | 'GOOGLE';
    email: string | null;
  }>(
    'SELECT social_provider AS provider, email FROM social_logins WHERE user_id = $1 ORDER BY social_login_id',
    [userId],
  );
  return {
    providers: result.rows.map((row) => row.provider),
    accounts: result.rows,
  };
}
