'use client';

import { useCallback } from 'react';

import { updateMeetingMemo } from '@/entities/host/api/updateMeetingMemo';
import { useHostMeeting } from '@/entities/host/model/HostMeetingContext';
import MeetingMemo from '@/features/meeting-memo/ui/MeetingMemo';

export default function HostMemoSection() {
  const { data, meetingId } = useHostMeeting();

  // API의 최신 메모 데이터를 우선으로 사용, 없으면 빈 문자열
  const initialValue = data?.memo ?? '';

  const handleSave = useCallback(
    async (value: string) => {
      try {
        await updateMeetingMemo({
          meetingId,
          memo: value,
        });
      } catch (err) {
        console.error('Failed to update memo', err);
        alert('메모 저장에 실패했습니다.');
      }
    },
    [meetingId],
  );

  return (
    <div className='px-5 pt-2'>
      <MeetingMemo
        key={initialValue}
        initialValue={initialValue}
        onSave={handleSave}
      />
    </div>
  );
}
