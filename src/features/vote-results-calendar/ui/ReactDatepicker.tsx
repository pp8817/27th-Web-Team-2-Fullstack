'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';

import { VoteResultsProps } from '@/entities/voteDateStat/dto/voteDateStat.dto';
import { calculateRank } from '@/entities/voteDateStat/lib/calculateRank';
import { trackEvent } from '@/shared/lib/amplitude';
import { isDateDisabled, parseDate } from '@/shared/lib/date';
import { isOffDay } from '@/shared/lib/holiday';
import { cn } from '@/shared/lib/utils';
import type { CalendarDateVariant } from '@/shared/ui/calendar-date/CalendarDate';
import CalendarDate from '@/shared/ui/calendar-date/CalendarDate';
import Icon from '@/shared/ui/icon/Icon';

import { VoteResultsShell } from './VoteResultsShell';

export function ReactDatePickerVoteResultsCalendar({
  openRange,
  stats,
  focusedParticipant,
}: VoteResultsProps & { focusedParticipant?: string | null }) {
  const [rawSelectedDate, setRawSelectedDate] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const minDate = parseDate(openRange.start);
  const maxDate = parseDate(openRange.end);

  const selectedDate = (() => {
    if (!rawSelectedDate) return null;

    if (focusedParticipant) {
      const stat = stats.find((s) => s.date === rawSelectedDate);
      const isParticipantPossible = stat?.can.some(
        (p) => p.name === focusedParticipant,
      );
      if (!isParticipantPossible) return null;
    }

    return rawSelectedDate;
  })();

  const selectedStat = selectedDate
    ? stats.find((s) => s.date === selectedDate) || null
    : null;

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    const stat = stats.find((s) => s.date === dateStr);

    if (!stat) return;

    if (focusedParticipant) {
      const isParticipantPossible = stat.can.some(
        (p) => p.name === focusedParticipant,
      );
      if (!isParticipantPossible) return;
    }

    trackEvent('voter_date_cell_click');

    if (selectedDate === dateStr) {
      setRawSelectedDate(null);
    } else {
      setRawSelectedDate(dateStr);
      trackEvent('voter_view_voter_count', {
        count: stat.can.length,
      });
    }
  };

  const renderDayContents = (day: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const stat = stats.find((s) => s.date === dateStr);
    const votes = stat ? stat.can.length : 0;
    const isCandidate = !!stat;
    const offDay = isOffDay(date);

    const simpleStats = stats.map((s) => ({
      date: s.date,
      count: s.can.length,
    }));
    const rank = calculateRank(simpleStats, dateStr);

    const isSelected = selectedDate === dateStr;
    const isDimmed = selectedDate !== null && !isSelected;

    let isFilteredOut = false;
    if (focusedParticipant && stat) {
      const isParticipantPossible = stat.can.some(
        (p) => p.name === focusedParticipant,
      );
      if (!isParticipantPossible) {
        isFilteredOut = true;
      }
    }

    let variant: CalendarDateVariant = 'default';
    const isInteractive =
      isCandidate && !isDateDisabled(dateStr, openRange) && !isFilteredOut;

    if (isCandidate) {
      if (isFilteredOut) {
        variant = offDay ? 'holiday' : 'default';
      } else if (votes > 0) {
        if (focusedParticipant) {
          variant = 'selected';
        } else if (rank !== null && rank <= 3) {
          if (rank === 1) variant = '1st';
          else if (rank === 2) variant = '2nd';
          else variant = '3rd';
        } else {
          variant = offDay ? 'secondary_holiday' : 'secondary';
        }
      } else {
        variant = offDay ? 'holiday' : 'default';
      }
    } else {
      variant = offDay ? 'other_holiday' : 'other';
    }

    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center py-1',
          !isInteractive && 'pointer-events-none',
          isInteractive && 'cursor-pointer',
          isDimmed && 'opacity-30',
        )}
      >
        <CalendarDate
          day={day}
          variant={variant}
          rank={!focusedParticipant ? rank : null}
        />
      </div>
    );
  };

  return (
    <VoteResultsShell
      selectedDate={selectedDate}
      onCloseDetail={() => setRawSelectedDate(null)}
      selectedStat={selectedStat}
      calendarRef={calendarRef}
    >
      <div className='react-datepicker-custom-wrapper flex w-full justify-center'>
        <DatePicker
          locale={ko}
          inline
          minDate={minDate}
          maxDate={maxDate}
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className='flex items-center justify-center gap-1.5 pt-4 pb-2'>
              <button
                onClick={() => {
                  trackEvent('voter_month_move_btn_click');
                  decreaseMonth();
                }}
                disabled={prevMonthButtonDisabled}
                type='button'
                className='flex items-center justify-center text-gray-400 transition-colors hover:text-gray-400 disabled:opacity-30'
              >
                <Icon name='arrow_prev' size={24} />
              </button>
              <span className='text-title-6 text-gray-800'>
                {format(date, 'M월')}
              </span>
              <button
                onClick={() => {
                  trackEvent('voter_month_move_btn_click');
                  increaseMonth();
                }}
                disabled={nextMonthButtonDisabled}
                type='button'
                className='flex items-center justify-center text-gray-400 transition-colors hover:text-gray-400 disabled:opacity-30'
              >
                <Icon name='arrow_next' size={24} />
              </button>
            </div>
          )}
          renderDayContents={renderDayContents}
          onChange={handleDateClick}
          selected={null}
          calendarClassName='!border-none !shadow-none !font-sans'
          dayClassName={() => 'bg-transparent'}
        />
      </div>
    </VoteResultsShell>
  );
}
