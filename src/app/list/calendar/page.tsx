'use client';

import { useCallback } from 'react';

import { getHostMeeting } from '@/entities/host/api/getHostMeeting';
import type { ConfirmedMeeting } from '@/features/meeting-calendar/model/types';
import MeetingCalendar from '@/features/meeting-calendar/ui/MeetingCalendar';
import { useConfirmedDashboard } from '@/features/meeting-list/model/DashboardContext';
import Icon from '@/shared/ui/icon/Icon';

export default function CalendarPage() {
  const { data, isLoading } = useConfirmedDashboard();

  const fetchMeetingDetails = useCallback(
    async (meetingIds: string[]): Promise<ConfirmedMeeting[]> => {
      const results = await Promise.all(
        meetingIds.map(async (id) => {
          const detail = await getHostMeeting(id);
          const finalizedDate = detail.finalizedDate!;
          const votedParticipants = detail.participants.filter(
            (p) => p.hasVoted,
          );

          const attendees = votedParticipants
            .filter((p) => p.voteDates.includes(finalizedDate))
            .map((p) => ({ id: String(p.id), name: p.name }));

          const absentees = votedParticipants
            .filter((p) => !p.voteDates.includes(finalizedDate))
            .map((p) => ({ id: String(p.id), name: p.name }));

          return {
            id: detail.id,
            title: detail.title,
            date: finalizedDate,
            memo: detail.memo ?? null,
            attendees,
            absentees,
          } satisfies ConfirmedMeeting;
        }),
      );

      return results;
    },
    [],
  );

  if (isLoading) {
    return null;
  }

  const meetingLabels =
    data?.meetings
      .filter((m) => m.finalizedDate)
      .map((m) => ({
        id: m.meetingId,
        title: m.title,
        date: m.finalizedDate!,
      })) ?? [];

  if (meetingLabels.length === 0) {
    return (
      <div className='flex h-63 w-full flex-col items-center justify-center gap-2.5 p-5'>
        <Icon
          name='ic_circle_x_filled'
          size={48}
          className='text-text-tertiary'
        />
        <p className='text-title-7 text-text-tertiary text-center'>
          확정된 일정이 없어요
        </p>
      </div>
    );
  }

  return (
    <div className='px-5 py-4'>
      <MeetingCalendar
        meetings={meetingLabels}
        fetchMeetingDetails={fetchMeetingDetails}
      />
    </div>
  );
}
