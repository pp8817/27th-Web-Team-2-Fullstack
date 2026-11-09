'use client';

import { differenceInCalendarDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';

import MeetingPreviewCard from '@/features/meeting-card/ui/MeetingPreviewCard';
import { useInProgressDashboard } from '@/features/meeting-list/model/DashboardContext';
import Icon from '@/shared/ui/icon/Icon';

export default function MeetingListPage() {
  const { data, isLoading } = useInProgressDashboard();
  const meetings = data?.meetings ?? [];

  if (isLoading) {
    return null;
  }

  if (meetings.length === 0) {
    return (
      <div className='flex h-63 w-full flex-col items-center justify-center gap-2.5 p-5'>
        <Icon
          name='ic_circle_x_filled'
          size={48}
          className='text-text-tertiary'
        />
        <p className='text-title-7 text-text-tertiary text-center'>
          투표 중인 모임이 없어요
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2 px-5 py-5'>
      {meetings.map((meeting) => (
        <Link key={meeting.meetingId} href={`/host/${meeting.meetingId}`}>
          <MeetingPreviewCard
            meeting={{
              id: meeting.meetingId,
              title: meeting.title,
              dDay: meeting.leadingDate
                ? Math.max(
                    0,
                    differenceInCalendarDays(
                      new Date(meeting.leadingDate),
                      new Date(),
                    ),
                  )
                : null,
              currentVotes: meeting.completedVoteCount,
              totalVotes: meeting.totalVoteCount,
              topDate: meeting.leadingDate
                ? format(new Date(meeting.leadingDate), 'M월 d일 EEEE', {
                    locale: ko,
                  })
                : '미정',
            }}
          />
        </Link>
      ))}
    </div>
  );
}
