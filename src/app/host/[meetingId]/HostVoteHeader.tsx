'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useHostMeeting } from '@/entities/host/model/HostMeetingContext';
import { BASE_URL } from '@/shared/config/constants';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { trackEvent } from '@/shared/lib/amplitude';
import LinkShareBottomSheet from '@/shared/ui/bottom-sheet/LinkShareBottomSheet';
import TopBar from '@/shared/ui/top-bar/TopBar';

interface HostVoteHeaderProps {
  className?: string;
}

export default function HostVoteHeader({ className }: HostVoteHeaderProps) {
  const { data, meetingId } = useHostMeeting();
  const title = data?.title ?? '';
  const url = `${BASE_URL}/meet/${meetingId}`;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shouldOpenShare = searchParams.get('trigger') === 'share';

  const {
    isOpen: isShareOpen,
    open: openShare,
    close: closeShare,
  } = useDisclosure(shouldOpenShare);

  useEffect(() => {
    if (shouldOpenShare) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('trigger');
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [shouldOpenShare, pathname, router, searchParams]);

  const handleOpenShare = () => {
    trackEvent('host_share_sheet_open', { entry_point: 'main_top' });
    openShare();
  };

  const handleBack = () => {
    router.push('/list');
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <TopBar
          title={title}
          leftIcon='arrow_prev'
          onLeftClick={handleBack}
          rightIcon='ic_other_share'
          onRightClick={handleOpenShare}
        />
      </div>

      <LinkShareBottomSheet
        isOpen={isShareOpen}
        onClose={closeShare}
        url={url}
      />
    </>
  );
}
