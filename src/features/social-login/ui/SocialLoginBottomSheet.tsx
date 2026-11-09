'use client';

import { useEffect } from 'react';

import { trackEvent } from '@/shared/lib/amplitude';
import BottomSheet from '@/shared/ui/bottom-sheet/BottomSheet';
import Icon from '@/shared/ui/icon/Icon';

interface SocialLoginBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onKakaoLogin: () => void;
  onGoogleLogin: () => void;
  onLater: () => void;
}

export default function SocialLoginBottomSheet({
  isOpen,
  onClose,
  onKakaoLogin,
  onGoogleLogin,
  onLater,
}: SocialLoginBottomSheetProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    trackEvent('social_login_sheet_open');
  }, [isOpen]);

  const handleKakaoLoginClick = () => {
    trackEvent('social_login_kakao_click');
    onKakaoLogin();
  };

  const handleGoogleLoginClick = () => {
    trackEvent('social_login_google_click');
    onGoogleLogin();
  };

  const handleLaterClick = () => {
    trackEvent('social_login_later_click');
    onLater();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} className='rounded-t-[20px]'>
      <div className='flex flex-col items-center px-1 pt-6 pb-4 text-center'>
        <h2 className='text-headline-5 text-gray-900'>모임이 만들어졌어요!</h2>
        <p className='text-body-4 mt-2 mb-6 text-gray-500'>
          소중한 모임, 잊지 않게 저장해보세요.
        </p>

        <div className='flex w-full flex-col gap-3'>
          <button
            type='button'
            className='text-title-8 flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] text-[#191919] active:scale-[0.98]'
            onClick={handleKakaoLoginClick}
          >
            <Icon name='ic_kakao' size={18} />
            <span>카카오로 시작하기</span>
          </button>

          <button
            type='button'
            className='text-title-8 text-text-primary border-line-clickable flex h-14 w-full items-center justify-center gap-2 rounded-lg border bg-white active:scale-[0.98]'
            onClick={handleGoogleLoginClick}
          >
            <Icon name='ic_google' size={18} />
            <span>Google 계정으로 계속하기</span>
          </button>
        </div>

        <button
          type='button'
          className='text-body-4 text-text-tertiary mt-5 active:opacity-70'
          onClick={handleLaterClick}
        >
          나중에 할게요
        </button>
      </div>
    </BottomSheet>
  );
}
