// 톡캘린더 호출에 필요한 카카오 토큰을 저장하고 갱신한다.
import type { PoolClient } from 'pg';
import { z } from 'zod';

import { ApiError } from '@/server/http';

const refreshResponse = z.object({
  access_token: z.string().min(1).max(2048),
  refresh_token: z.string().max(2048).optional(),
  expires_in: z.number().positive(),
  refresh_token_expires_in: z.number().positive().optional(),
  scope: z.string().max(1024).optional(),
});

type KakaoToken = Omit<z.infer<typeof refreshResponse>, 'expires_in'> & {
  expires_in?: number;
};

export async function refreshKakaoToken(refreshToken: string) {
  const clientId = process.env.KAKAO_CLIENT_ID;
  const clientSecret = process.env.KAKAO_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new ApiError(503, '카카오 캘린더 연동 설정이 필요합니다.');
  }
  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new ApiError(502, '카카오 토큰을 갱신할 수 없습니다.');
  }
  return refreshResponse.parse(await response.json());
}

export async function saveKakaoToken(
  client: PoolClient,
  userId: string,
  token: KakaoToken,
) {
  await client.query(
    `INSERT INTO social_oauth_tokens(user_id, provider, access_token, refresh_token,
      access_token_expires_at, refresh_token_expires_at, scope)
      VALUES ($1, 'KAKAO', $2, $3, $4, $5, $6)
      ON CONFLICT(user_id, provider) DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token = COALESCE(EXCLUDED.refresh_token, social_oauth_tokens.refresh_token),
        access_token_expires_at = EXCLUDED.access_token_expires_at,
        refresh_token_expires_at = CASE WHEN EXCLUDED.refresh_token IS NULL
          THEN social_oauth_tokens.refresh_token_expires_at ELSE EXCLUDED.refresh_token_expires_at END,
        scope = COALESCE(EXCLUDED.scope, social_oauth_tokens.scope)`,
    [
      userId,
      token.access_token,
      token.refresh_token,
      token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : null,
      token.refresh_token_expires_in
        ? new Date(Date.now() + token.refresh_token_expires_in * 1000)
        : null,
      token.scope,
    ],
  );
}
