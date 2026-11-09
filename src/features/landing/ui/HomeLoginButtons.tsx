'use client';

import { useRouter } from 'next/navigation';

import useSocialLogin from '@/features/social-login/model/useSocialLogin';
import { DOMAIN_TARGET_MAP } from '@/shared/config/constants';
import Icon from '@/shared/ui/icon/Icon';

export default function HomeLoginButtons() {
  const router = useRouter();
  const { handleKakaoLogin, handleGoogleLogin } = useSocialLogin();

  const handleLookAround = () => {
    router.push('/create');
  };

  return (
    <div className='flex w-full flex-col gap-2'>
      <button
        type='button'
        onClick={() => handleKakaoLogin(DOMAIN_TARGET_MAP.list)}
        className='flex h-13.5 w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] active:scale-[0.98]'
      >
        <Icon name='ic_kakao' size={18} />
        <span className='text-[15px] leading-5.5 font-medium tracking-[-0.3px] text-[rgba(0,0,0,0.85)]'>
          카카오로 시작하기
        </span>
      </button>

      <button
        type='button'
        onClick={() => handleGoogleLogin(DOMAIN_TARGET_MAP.list)}
        className='flex h-13.5 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white active:scale-[0.98]'
      >
        <Icon name='ic_google' size={18} />
        <span className='text-[15px] leading-5.5 font-medium tracking-[-0.3px] text-[#1f1f1f]'>
          Google 계정으로 계속하기
        </span>
      </button>

      <button
        type='button'
        onClick={handleLookAround}
        className='mt-1.5 text-center'
      >
        <span className='text-text-secondary border-b border-gray-400 text-sm leading-4 tracking-[-0.28px] whitespace-nowrap'>
          로그인 없이 둘러보기
        </span>
      </button>
    </div>
  );
}
