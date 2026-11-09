// 브라우저에서 같은 출처의 웨딘 API를 호출하고 만료된 세션을 갱신한다.
import ky from 'ky';

import { clearStoredUserInfo } from '@/shared/lib/storage';

const base = ky.create({
  prefixUrl: '/api',
  credentials: 'same-origin',
  retry: 0,
});
let refreshPromise: Promise<boolean> | null = null;

function refreshSession() {
  refreshPromise ??= base
    .post('v1/auth/refresh-cookie')
    .then(
      () => true,
      () => false,
    )
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export const api = base.extend({
  retry: {
    limit: 1,
    statusCodes: [],
    retryOnTimeout: false,
    shouldRetry: () => false,
  },
  hooks: {
    afterResponse: [
      async (_request, _options, response, { retryCount }) => {
        if (response.status !== 401 || retryCount > 0) return;
        if (await refreshSession())
          return ky.retry({ code: 'SESSION_REFRESHED' });
        if (typeof window !== 'undefined' && window.location.pathname !== '/') {
          clearStoredUserInfo();
          window.location.replace(new URL('/', window.location.origin).href);
        }
      },
    ],
  },
});
