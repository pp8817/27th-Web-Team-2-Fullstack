'use client';

import { differenceInCalendarDays } from 'date-fns';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

import type { MeetingDashboardCard } from '@/entities/host/dto/dashboard.dto';
import {
  useConfirmedDashboard,
  useInProgressDashboard,
} from '@/features/meeting-list/model/DashboardContext';
import { getKoreaStandardTime } from '@/shared/lib/date';
import { Header } from '@/shared/ui/header/Header';
import { TextHighlight } from '@/shared/ui/text/Highlight';

function getUpcomingMeeting(
  meetings: MeetingDashboardCard[],
): { title: string; daysLeft: number } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = meetings
    .filter((m) => m.finalizedDate)
    .map((m) => ({
      title: m.title,
      daysLeft: differenceInCalendarDays(new Date(m.finalizedDate!), today),
    }))
    .filter((m) => m.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return upcoming[0] ?? null;
}

export default function ListHeader() {
  const pathname = usePathname();
  const isCalendar = pathname.startsWith('/list/calendar');
  const { data: inProgressData, refetch: refetchInProgress } =
    useInProgressDashboard();
  const { data: confirmedData, refetch: refetchConfirmed } =
    useConfirmedDashboard();
  const [timeString, setTimeString] = useState(getKoreaStandardTime);

  const handleRefresh = useCallback(() => {
    if (isCalendar) {
      refetchConfirmed();
    } else {
      refetchInProgress();
    }
    setTimeString(getKoreaStandardTime());
  }, [isCalendar, refetchInProgress, refetchConfirmed]);

  if (isCalendar) {
    const confirmedMeetings = confirmedData?.meetings ?? [];
    const upcoming = getUpcomingMeeting(confirmedMeetings);

    if (upcoming) {
      return (
        <Header
          title={
            <>
              <TextHighlight>{upcoming.title}</TextHighlight> 청모가
              <br />
              {upcoming.daysLeft}일 남았어요
            </>
          }
          standardTime={timeString}
          onRefresh={handleRefresh}
        />
      );
    }

    if (confirmedMeetings.length === 0) {
      return (
        <Header
          title={
            <>
              확정된 일정이
              <br />
              아직 없어요
            </>
          }
          standardTime={timeString}
          onRefresh={handleRefresh}
        />
      );
    }

    return (
      <Header
        title={
          <>
            확정된 일정이
            <br />
            <TextHighlight>{confirmedMeetings.length}개</TextHighlight> 있어요
          </>
        }
        standardTime={timeString}
        onRefresh={handleRefresh}
      />
    );
  }

  // 투표중 탭
  const meetingCount = inProgressData?.summary.votingCount ?? 0;

  if (meetingCount === 0) {
    return (
      <Header
        title={
          <>
            모임 만들기를 눌러
            <br />
            투표를 시작해보세요!
          </>
        }
        standardTime={timeString}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <Header
      title={
        <>
          현재 투표중인
          <br />
          청모가 <TextHighlight>{meetingCount}개</TextHighlight> 있어요
        </>
      }
      standardTime={timeString}
      onRefresh={handleRefresh}
    />
  );
}
