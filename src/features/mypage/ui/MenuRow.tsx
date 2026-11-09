import Link from 'next/link';

import { IconName } from '@/shared/assets/icons/iconRegistry';
import { cn } from '@/shared/lib/utils';
import Icon from '@/shared/ui/icon/Icon';

interface MenuRowProps {
  label: string;
  icon: IconName;
  href?: string;
  onClick?: () => void;
}

export default function MenuRow({ label, icon, href, onClick }: MenuRowProps) {
  const content = (
    <>
      <div className='flex items-center gap-2'>
        <Icon name={icon} size={20} className='text-gray-400' />
        <span className='text-body-3 text-text-primary'>{label}</span>
      </div>
      <Icon name='arrow_next' size={20} className='text-gray-400' />
    </>
  );

  const className =
    'border-b border-gray-100 px-5 py-[18px] flex justify-between items-center';

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type='button' onClick={onClick} className={cn(className, 'w-full')}>
      {content}
    </button>
  );
}
