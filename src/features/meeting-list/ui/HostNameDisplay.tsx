'use client';

import Link from 'next/link';

import { useHostName } from '@/shared/hooks/useHostName';
import Icon from '@/shared/ui/icon/Icon';

export default function HostNameDisplay() {
  const hostName = useHostName();

  return (
    <Link href='/mypage' className='flex items-center gap-1.5'>
      <Icon name='ic_avatar' size={20} className='text-gray-600' />
      <span className='text-title-8 text-text-primary'>{hostName}님</span>
    </Link>
  );
}
