'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { Tab } from '@/features/meeting-list/model/types';
import { cn } from '@/shared/lib/utils';

interface MeetingListTabProps {
  tabs: Tab[];
}

export default function MeetingListTab({ tabs }: MeetingListTabProps) {
  const pathname = usePathname();

  return (
    <div className='flex w-full'>
      {tabs.map((tab) => {
        const isActive =
          tab.href === '/list'
            ? pathname === '/list'
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'text-body-3 flex h-[46px] flex-1 items-center justify-center px-2.5 transition-colors',
              isActive
                ? 'border-b border-gray-600 font-semibold text-gray-700'
                : 'text-text-quaternary border-b border-gray-200',
            )}
          >
            <span className='relative'>
              {tab.label}
              {tab.hasAlert && (
                <span className='bg-primary-default absolute left-full ml-0.5 h-1 w-1 rounded-full' />
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
