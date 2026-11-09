import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useRef } from 'react';

import { VoteDateStat } from '@/entities/voteDateStat/dto/voteDateStat.dto';
import AttendanceGroup from '@/shared/ui/attendance-group/AttendanceGroup';

type VoteResultsShellProps = {
  children: React.ReactNode;
  selectedDate: string | null;
  onCloseDetail?: () => void;
  selectedStat: VoteDateStat | null;
  calendarRef?: React.RefObject<HTMLDivElement | null>;
};

export function VoteResultsShell({
  children,
  selectedDate,
  selectedStat,
  calendarRef,
}: VoteResultsShellProps) {
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDate && detailRef.current) {
      detailRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [selectedDate]);

  return (
    <div className='flex flex-col gap-2' ref={calendarRef}>
      {/* 1. Calendar Area */}
      <div className='flex justify-center rounded-[8px] bg-white shadow-[0px_0px_30px_0px_rgba(0,0,0,0.04)]'>
        {children}
      </div>

      {/* 2. Detail Section */}
      {selectedDate && (
        <div
          ref={detailRef}
          className='animate-in slide-in-from-top-4 fade-in relative flex scroll-mb-24 flex-col gap-6 rounded-[8px] bg-white p-5 shadow-[0px_0px_30px_0px_rgba(0,0,0,0.04)] duration-300'
        >
          {/* Header */}
          <div className='flex flex-col gap-1.5'>
            <h3 className='text-caption-7 text-gray-600'>
              {format(parseISO(selectedDate), 'M월 d일 EEEE', { locale: ko })}
            </h3>
            <span className='text-title-6 text-gray-900'>
              <span className='text-primary-subtle'>
                {selectedStat ? selectedStat.can.length : 0}
              </span>
              명이 함께할 수 있어요
            </span>
          </div>

          <div className='flex flex-col gap-4.25'>
            <AttendanceGroup
              type='can'
              participants={selectedStat?.can ?? []}
              emptyMessage='가능한 사람이 없습니다.'
            />
            <AttendanceGroup
              type='cannot'
              participants={selectedStat?.cannot ?? []}
              emptyMessage='안되는 사람이 없어요'
            />
          </div>
        </div>
      )}
    </div>
  );
}
