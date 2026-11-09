// 구글·카카오 OAuth 토큰 교환과 프로필 조회를 처리한다.
import { z } from 'zod';

import { ApiError } from '@/server/http';

export type Provider = 'google' | 'kakao';

export const providers = {
  google: {
    authorize: 'https://accounts.google.com/o/oauth2/v2/auth',
    token: 'https://oauth2.googleapis.com/token',
    profile: 'https://openidconnect.googleapis.com/v1/userinfo',
    scope: 'openid profile email',
  },
  kakao: {
    authorize: 'https://kauth.kakao.com/oauth/authorize',
    token: 'https://kauth.kakao.com/oauth/token',
    profile: 'https://kapi.kakao.com/v2/user/me',
    scope: 'profile_nickname,talk_calendar',
  },
} as const;

export function credentials(provider: Provider) {
  const clientId =
    provider === 'google'
      ? process.env.GOOGLE_CLIENT_ID
      : process.env.KAKAO_CLIENT_ID;
  const clientSecret =
    provider === 'google'
      ? process.env.GOOGLE_CLIENT_SECRET
      : process.env.KAKAO_CLIENT_SECRET;
  if (!clientId || (provider === 'google' && !clientSecret)) {
    throw new ApiError(503, '소셜 로그인 설정이 필요합니다.');
  }
  return { clientId, clientSecret };
}

const tokenSchema = z.object({
  access_token: z.string().min(1).max(2048),
  refresh_token: z.string().max(2048).optional(),
  expires_in: z.number().positive(),
  refresh_token_expires_in: z.number().positive().optional(),
  scope: z.string().max(1024).optional(),
});

export type ProviderToken = z.infer<typeof tokenSchema>;

export async function providerToken(
  provider: Provider,
  parameters: Record<string, string>,
) {
  const { clientId, clientSecret } = credentials(provider);
  const form = new URLSearchParams({ ...parameters, client_id: clientId });
  if (clientSecret) form.set('client_secret', clientSecret);

  const response = await fetch(providers[provider].token, {
    method: 'POST',
    body: form,
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new ApiError(502, '소셜 인증을 완료할 수 없습니다.');
  }
  return tokenSchema.parse(await response.json());
}

const googleProfile = z.object({
  sub: z.string().min(1),
  name: z.string().optional(),
  email: z.string().optional(),
  picture: z.string().optional(),
});

const kakaoProfile = z.object({
  id: z.union([z.string().min(1), z.number().int().safe()]),
  kakao_account: z
    .object({
      email: z.string().optional(),
      profile: z
        .object({
          nickname: z.string().optional(),
          profile_image_url: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export async function providerProfile(provider: Provider, accessToken: string) {
  const response = await fetch(providers[provider].profile, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new ApiError(502, '소셜 프로필을 가져올 수 없습니다.');
  }
  const profile: unknown = await response.json();
  if (provider === 'google') {
    const data = googleProfile.parse(profile);
    return {
      id: data.sub,
      name: data.name,
      email: data.email,
      image: data.picture,
    };
  }

  const data = kakaoProfile.parse(profile);
  return {
    id: String(data.id),
    name: data.kakao_account?.profile?.nickname,
    email: data.kakao_account?.email,
    image: data.kakao_account?.profile?.profile_image_url,
  };
}
