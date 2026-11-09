'use client';

import Link from 'next/link';

import useSocialLogin from '../model/useSocialLogin';
import SocialLoginBottomSheet from './SocialLoginBottomSheet';

export default function SocialLoginTestPage() {
  const {
    isBottomSheetOpen,
    openBottomSheet,
    closeBottomSheet,
    handleKakaoLogin,
    handleGoogleLogin,
    handleLater,
  } = useSocialLogin();

  return (
    <main className='flex min-h-screen flex-col px-5 pt-12 pb-8'>
      <section className='space-y-2'>
        <h1 className='text-headline-6 text-text-primary'>
          소셜 로그인 테스트
        </h1>
        <p className='text-body-4 text-text-secondary'>
          카카오와 구글 로그인 시도를 테스트할 수 있어요.
        </p>
      </section>

      <section className='mt-8 space-y-3'>
        <button
          type='button'
          className='text-body-2 bg-primary-default text-text-inverse flex h-14 w-full items-center justify-center rounded-lg active:scale-[0.98]'
          onClick={openBottomSheet}
        >
          로그인하기
        </button>

        <Link
          href='/test/login/result'
          className='text-body-4 text-text-secondary border-line-clickable flex h-12 w-full items-center justify-center rounded-lg border bg-white active:scale-[0.98]'
        >
          로그인 결과 확인하기
        </Link>
      </section>

      <SocialLoginBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={closeBottomSheet}
        onKakaoLogin={() => handleKakaoLogin('list')}
        onGoogleLogin={() => handleGoogleLogin('list')}
        onLater={handleLater}
      />
    </main>
  );
}
