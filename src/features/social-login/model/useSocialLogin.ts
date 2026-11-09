'use client';
// 기존 로그인 버튼을 같은 출처의 OAuth 시작 경로에 연결한다.

import { useCallback } from 'react';

import { useDisclosure } from '@/shared/hooks/useDisclosure';

type Target = 'list' | 'mypage' | 'create' | 'account';

export function startSocialLogin(provider: 'kakao' | 'google', target: Target) {
  const path = `/api/v1/auth/oauth/${provider}/start?target=${target}`;
  window.location.assign(new URL(path, window.location.origin).href);
}

export default function useSocialLogin() {
  const { isOpen, open, close } = useDisclosure();

  const handleKakaoLogin = useCallback(
    (target: Target, beforeLogin?: () => void) => {
      beforeLogin?.();
      startSocialLogin('kakao', target);
    },
    [],
  );

  const handleGoogleLogin = useCallback(
    (target: Target, beforeLogin?: () => void) => {
      beforeLogin?.();
      startSocialLogin('google', target);
    },
    [],
  );

  return {
    isBottomSheetOpen: isOpen,
    openBottomSheet: open,
    closeBottomSheet: close,
    handleKakaoLogin,
    handleGoogleLogin,
    handleLater: close,
  };
}
