'use client';

import { useRouter } from 'next/navigation';

import TopBar from '@/shared/ui/top-bar/TopBar';

export default function PolicyPage() {
  const router = useRouter();

  return (
    <div className='flex min-h-dvh flex-col bg-white'>
      <TopBar
        title='약관 및 정책'
        leftIcon='arrow_prev'
        onLeftClick={() => router.back()}
      />
      <div className='flex flex-1 items-center justify-center'>
        <p className='text-body-4 text-text-tertiary'>
          약관 및 정책 페이지 준비 중입니다.
        </p>
      </div>
    </div>
  );
}
