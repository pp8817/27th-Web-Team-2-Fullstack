'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { VoteResultsProps } from '@/entities/voteDateStat/dto/voteDateStat.dto';
import { buildMeetingCalendarUrl } from '@/shared/lib/googleCalendar';
import Button from '@/shared/ui/button/Button';
import { Header } from '@/shared/ui/header/Header';
import { TextHighlight } from '@/shared/ui/text/Highlight';
import TopBar from '@/shared/ui/top-bar/TopBar';

import { VoteResultsShell } from './VoteResultsShell';

interface ParticipantConfirmedViewProps {
  hostName: string;
  meetingId: string;
  confirmedDate: string;
  stats: VoteResultsProps['stats'];
}

export function ParticipantConfirmedView({
  hostName,
  confirmedDate,
  stats,
}: ParticipantConfirmedViewProps) {
  const selectedStat = stats.find((s) => s.date === confirmedDate) || null;

  const formattedDate = format(new Date(confirmedDate), 'M월 d일 EEEE', {
    locale: ko,
  });

  return (
    <div className='bg-gray-0 flex min-h-screen flex-col'>
      <TopBar title={`${hostName}님의 청첩장 모임`} />
      <Header
        title={
          <div className='flex w-full flex-col gap-1'>
            <p className='text-headline-5'>우리 청모는</p>
            <div className='flex items-center gap-1'>
              <TextHighlight>{formattedDate}</TextHighlight>
              <span className='text-headline-5'>로 확정되었어요</span>
            </div>
          </div>
        }
      />

      <div className='mt-3 flex w-full flex-col items-center px-5'>
        <div className='w-full'>
          <VoteResultsShell
            selectedDate={confirmedDate}
            selectedStat={selectedStat}
          >
            {/* DatePicker is not needed as per request */}
            <div className='hidden' />
          </VoteResultsShell>
        </div>
      </div>

      <div className='bg-gray-0 fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-screen-sm px-5 py-4 shadow-[0px_-7px_20px_10px_var(--color-gray-0)]'>
        <Button
          fullWidth
          onClick={() => {
            const url = buildMeetingCalendarUrl({
              title: `${hostName}님의 청첩장 모임`,
              date: confirmedDate,
              attendees: selectedStat?.can ?? [],
              absentees: selectedStat?.cannot ?? [],
            });
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
        >
          구글캘린더에 등록하기
        </Button>
      </div>
    </div>
  );
}
