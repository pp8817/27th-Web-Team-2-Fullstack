'use client';

import { useRouter } from 'next/navigation';

import Icon from '@/shared/ui/icon/Icon';

export default function FloatingActionButton() {
  const router = useRouter();

  return (
    <button
      type='button'
      onClick={() => router.push('/create')}
      className='absolute right-5 bottom-8 z-50 flex items-center gap-1 rounded-full bg-gray-800 py-2.5 pr-4 pl-3 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.14)] active:scale-95'
    >
      <Icon name='ic_plus' size={16} className='text-white' />
      <span className='text-title-7 text-white'>모임 만들기</span>
    </button>
  );
}
