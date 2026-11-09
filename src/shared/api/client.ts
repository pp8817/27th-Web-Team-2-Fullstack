// 브라우저에서 같은 출처의 웨딘 API를 호출한다.
import ky from 'ky';

import { clearStoredUserInfo } from '@/shared/lib/storage';

export const api = ky.create({
  prefixUrl: '/api',
  credentials: 'same-origin',
  retry: 0,
  hooks: {
    afterResponse: [
      (_request, _options, response) => {
        if (response.status === 401 && typeof window !== 'undefined') {
          clearStoredUserInfo();
          if (window.location.pathname !== '/') {
            window.location.replace(new URL('/', window.location.origin).href);
          }
        }
      },
    ],
  },
});
