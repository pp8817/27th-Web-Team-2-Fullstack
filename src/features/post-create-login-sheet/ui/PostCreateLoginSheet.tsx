'use client';

import BottomSheet from '@/shared/ui/bottom-sheet/BottomSheet';
import Icon from '@/shared/ui/icon/Icon';

interface PostCreateLoginSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onKakaoLogin?: () => void;
  onGoogleLogin?: () => void;
}

export default function PostCreateLoginSheet({
  isOpen,
  onClose,
  onKakaoLogin,
  onGoogleLogin,
}: PostCreateLoginSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center pt-6'>
        <h3 className='text-headline-5 text-text-primary text-center'>
          모임이 만들어졌어요!
        </h3>
        <p className='text-body-2 text-text-tertiary mt-1 text-center'>
          소중한 모임, 잊지 않게 저장해보세요.
        </p>

        <div className='mt-5 flex w-full flex-col gap-2'>
          <button
            type='button'
            onClick={onKakaoLogin}
            className='flex h-13.5 w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] active:scale-[0.98]'
          >
            <Icon name='ic_kakao' size={18} />
            <span className='text-[15px] leading-5.5 font-medium tracking-[-0.3px] text-[rgba(0,0,0,0.85)]'>
              카카오로 시작하기
            </span>
          </button>
          <button
            type='button'
            onClick={onGoogleLogin}
            className='flex h-13.5 w-full items-center justify-center gap-2 rounded-xl border border-[#E5DEDE] bg-white active:scale-[0.98]'
          >
            <Icon name='ic_google' size={18} />
            <span className='text-[15px] leading-5.5 font-medium tracking-[-0.3px] text-[#1f1f1f]'>
              Google 계정으로 계속하기
            </span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
