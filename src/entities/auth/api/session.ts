// 로그아웃과 연결된 소셜 계정 조회 API를 호출한다.
import { z } from 'zod';

import { api } from '@/shared/api/client';

const socialAccount = z.object({
  provider: z.enum(['KAKAO', 'GOOGLE']),
  email: z.string().nullable(),
});

export type SocialAccount = z.infer<typeof socialAccount>;

export async function getSocialAccounts(signal?: AbortSignal) {
  const response = await api
    .get('v1/auth/me/social-accounts', { signal })
    .json<unknown>();
  return z.object({ accounts: z.array(socialAccount) }).parse(response)
    .accounts;
}

export async function logout() {
  await api.post('v1/auth/logout');
}
