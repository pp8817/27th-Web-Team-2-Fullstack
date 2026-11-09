'use client';

import { useRouter } from 'next/navigation';

import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { useHostName } from '@/shared/hooks/useHostName';
import TopBar from '@/shared/ui/top-bar/TopBar';

import LogoutBottomSheet from './LogoutBottomSheet';
import MenuRow from './MenuRow';
import WithdrawBottomSheet from './WithdrawBottomSheet';

export default function MypagePage() {
  const router = useRouter();
  const hostName = useHostName();
  const logoutSheet = useDisclosure();
  const withdrawSheet = useDisclosure();

  return (
    <div className='flex min-h-dvh flex-col bg-gray-50'>
      <TopBar
        title='마이페이지'
        leftIcon='arrow_prev'
        onLeftClick={() => router.back()}
      />
      <div className='flex w-full items-center px-5 pt-6 pb-2'>
        <h2 className='text-title-4 text-text-primary whitespace-pre-wrap'>
          {'결혼 축하드려요\n'}
          <span className='text-primary-subtle'>{hostName}</span>
          {'님💍'}
        </h2>
      </div>

      <div className='bg-gray-0 m-5 rounded-xl'>
        <MenuRow label='계정 관리' icon='ic_people' href='/mypage/account' />
        <MenuRow label='약관 및 정책' icon='ic_license' href='/mypage/policy' />
        <MenuRow label='로그아웃' icon='ic_logout' onClick={logoutSheet.open} />
      </div>

      <div className='flex justify-center'>
        <button
          type='button'
          className='text-caption-6 text-text-tertiary underline'
          onClick={withdrawSheet.open}
        >
          탈퇴하기
        </button>
      </div>

      <LogoutBottomSheet
        isOpen={logoutSheet.isOpen}
        onClose={logoutSheet.close}
        hostName={hostName}
      />
      <WithdrawBottomSheet
        isOpen={withdrawSheet.isOpen}
        onClose={withdrawSheet.close}
      />
    </div>
  );
}
