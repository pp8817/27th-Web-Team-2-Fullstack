import Image from 'next/image';

import { DashboardProvider } from '@/features/meeting-list/model/DashboardContext';
import { TABS } from '@/features/meeting-list/model/types';
import HostNameDisplay from '@/features/meeting-list/ui/HostNameDisplay';
import ListHeader from '@/features/meeting-list/ui/ListHeader';
import MeetingListTab from '@/features/meeting-list/ui/MeetingListTab';

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className='relative flex h-dvh flex-col bg-gray-50'>
        {/* TopBar - main variant */}
        <header className='flex w-full shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-3'>
          <div className='flex items-center gap-1'>
            <Image
              src='/app-icon.png'
              alt='weddin'
              width={22}
              height={22}
              className='rounded-[5px]'
            />
            <Image src='/weddin-logo.svg' alt='weddin' width={66} height={16} />
          </div>
          <HostNameDisplay />
        </header>

        {/* Header + Tabs */}
        <div className='flex flex-col gap-1.5'>
          <ListHeader />
          <MeetingListTab tabs={TABS} />
        </div>

        {/* Content area */}
        <div className='flex-1 overflow-y-auto'>{children}</div>
      </div>
    </DashboardProvider>
  );
}
