'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  getSocialAccounts,
  type SocialAccount,
} from '@/entities/auth/api/session';
import { startSocialLogin } from '@/features/social-login/model/useSocialLogin';
import Icon from '@/shared/ui/icon/Icon';
import Toggle from '@/shared/ui/toggle/Toggle';
import TopBar from '@/shared/ui/top-bar/TopBar';

type Provider = 'kakao' | 'google';

function KakaoIcon() {
  return (
    <div className='bg-kakao flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-xl'>
      <Icon name='ic_kakao' size={14} />
    </div>
  );
}

function GoogleIcon() {
  return (
    <div className='bg-gray-0 flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200'>
      <Icon name='ic_google' size={14} />
    </div>
  );
}

function ProviderIcon({ provider }: { provider: Provider }) {
  return provider === 'kakao' ? <KakaoIcon /> : <GoogleIcon />;
}

export default function AccountPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    getSocialAccounts(controller.signal)
      .then(setAccounts)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const account = accounts[0];
  const provider = account?.provider === 'GOOGLE' ? 'google' : 'kakao';
  const email = account?.email ?? '';
  const isLinked = accounts.length > 1;
  const linkedProvider: Provider = provider === 'kakao' ? 'google' : 'kakao';
  const linkedLabel =
    linkedProvider === 'kakao' ? '카카오 계정 연결' : '구글 계정 연결';

  return (
    <div className='bg-gray-0 flex min-h-dvh flex-col'>
      <TopBar
        title='계정 관리'
        leftIcon='arrow_prev'
        onLeftClick={() => router.back()}
      />

      <div className='flex flex-col gap-[30px] py-5'>
        {/* 로그인 계정 정보 */}
        <div className='flex flex-col px-5'>
          <span className='text-title-8 text-gray-600'>로그인 계정 정보</span>
          <div className='flex items-center gap-2 py-3'>
            <ProviderIcon provider={provider} />
            <span className='text-body-2 text-gray-600'>{email}</span>
          </div>
        </div>

        {/* 계정 연동 */}
        <div className='flex flex-col px-5'>
          <span className='text-title-8 text-gray-600'>계정 연동</span>
          <div className='flex items-center justify-between py-3'>
            <div className='flex flex-1 items-center gap-2'>
              <ProviderIcon provider={linkedProvider} />
              <span className='text-body-2 text-gray-600'>{linkedLabel}</span>
            </div>
            <Toggle
              checked={isLinked}
              onChange={() => {
                if (account && !isLinked)
                  startSocialLogin(linkedProvider, 'account');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
