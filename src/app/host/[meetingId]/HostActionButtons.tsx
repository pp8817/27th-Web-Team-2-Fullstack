'use client';

import Link from 'next/link';

import { useHostMeeting } from '@/entities/host/model/HostMeetingContext';
import { trackEvent } from '@/shared/lib/amplitude';
import Button from '@/shared/ui/button/Button';

export default function HostActionButtons() {
  const { meetingId } = useHostMeeting();

  const handleEditClick = () => {
    trackEvent('host_edit_meeting_cta_click');
  };

  const handleCloseClick = () => {
    trackEvent('host_close_vote_cta_click');
  };

  return (
    <div className='bg-gray-0 fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-screen-sm px-5 py-4 shadow-[0px_-7px_20px_10px_var(--color-gray-0)]'>
      <div className='flex gap-2.5'>
        <Link
          href={`/host/${meetingId}/edit`}
          className='flex-1'
          onClick={handleEditClick}
        >
          <Button variant='secondary' fullWidth>
            모임 수정하기
          </Button>
        </Link>
        <Link
          href={`/host/${meetingId}/close`}
          className='flex-1'
          onClick={handleCloseClick}
        >
          <Button fullWidth>마감하기</Button>
        </Link>
      </div>
    </div>
  );
}
