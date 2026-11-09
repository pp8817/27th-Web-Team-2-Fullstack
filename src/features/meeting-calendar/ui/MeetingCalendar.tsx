'use client';

import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';

import { isOffDay } from '@/shared/lib/holiday';
import { cn } from '@/shared/lib/utils';
import type { CalendarDateVariant } from '@/shared/ui/calendar-date/CalendarDate';
import CalendarDate from '@/shared/ui/calendar-date/CalendarDate';
import Icon from '@/shared/ui/icon/Icon';

import type {
  ConfirmedMeeting,
  MeetingCalendarProps,
  MeetingLabel,
} from '../model/types';
import MeetingDetailCard from './MeetingDetailCard';

export default function MeetingCalendar({
  meetings,
  fetchMeetingDetails,
  className,
}: MeetingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [displayedMonth, setDisplayedMonth] = useState<Date>(new Date());
  const [detailMeetings, setDetailMeetings] = useState<
    ConfirmedMeeting[] | null
  >(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const detailCacheRef = useRef<Record<string, ConfirmedMeeting[]>>({});
  const latestRequestRef = useRef<string | null>(null);

  const meetingsByDate = useMemo(() => {
    return meetings.reduce<Record<string, MeetingLabel[]>>((acc, meeting) => {
      if (!acc[meeting.date]) {
        acc[meeting.date] = [];
      }
      acc[meeting.date].push(meeting);
      return acc;
    }, {});
  }, [meetings]);

  const fetchDetails = useCallback(
    async (dateStr: string, meetingsOnDate: MeetingLabel[]) => {
      // fetchMeetingDetails가 없으면 meetings를 ConfirmedMeeting으로 직접 사용 (스토리북 등)
      if (!fetchMeetingDetails) {
        setDetailMeetings(
          meetingsOnDate.map((m) => ({
            ...m,
            attendees: [],
            absentees: [],
          })),
        );
        return;
      }

      const cached = detailCacheRef.current[dateStr];
      if (cached) {
        setDetailMeetings(cached);
        return;
      }

      latestRequestRef.current = dateStr;
      setIsDetailLoading(true);
      setDetailMeetings(null);

      try {
        const ids = meetingsOnDate.map((m) => m.id);
        const results = await fetchMeetingDetails(ids);
        if (latestRequestRef.current !== dateStr) return;
        detailCacheRef.current[dateStr] = results;
        setDetailMeetings(results);
      } catch {
        if (latestRequestRef.current !== dateStr) return;
        setDetailMeetings(null);
      } finally {
        if (latestRequestRef.current === dateStr) {
          setIsDetailLoading(false);
        }
      }
    },
    [fetchMeetingDetails],
  );

  useEffect(() => {
    if (selectedDate && detailRef.current) {
      const el = detailRef.current;
      const timerId = setTimeout(() => {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }, 50);

      return () => clearTimeout(timerId);
    }
  }, [selectedDate, detailMeetings]);

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    const meetingsOnDate = meetingsByDate[dateStr];

    if (!meetingsOnDate || meetingsOnDate.length === 0) return;

    if (selectedDate === dateStr) {
      setSelectedDate(null);
      setDetailMeetings(null);
    } else {
      setSelectedDate(dateStr);
      setActiveCardIndex(0);
      fetchDetails(dateStr, meetingsOnDate);
    }
  };

  const renderDayContents = (day: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dateMeetings = meetingsByDate[dateStr] || [];
    const hasMeetings = dateMeetings.length > 0;
    const offDay = isOffDay(date);
    const isToday = isSameDay(date, new Date());
    const isSelected = selectedDate === dateStr;
    const isCurrentMonth =
      date.getMonth() === displayedMonth.getMonth() &&
      date.getFullYear() === displayedMonth.getFullYear();

    let variant: CalendarDateVariant = 'default';
    if (isSelected) {
      variant = 'meeting_selected';
    } else if (!isCurrentMonth && offDay) {
      variant = 'other_holiday';
    } else if (!isCurrentMonth) {
      variant = 'other';
    } else if (hasMeetings && offDay) {
      variant = 'secondary_holiday';
    } else if (offDay) {
      variant = 'holiday';
    }

    const labels = dateMeetings.slice(0, 2).map((meeting, index) => ({
      id: meeting.id,
      title: meeting.title,
      isActive: isSelected && index === activeCardIndex,
    }));

    return (
      <CalendarDate
        className='h-full w-full gap-2'
        day={day}
        variant={variant}
        isToday={isToday}
        labels={labels.length > 0 ? labels : undefined}
      />
    );
  };

  const showDetailCard =
    selectedDate && detailMeetings && detailMeetings.length > 0;

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      {/* Calendar */}
      <div className='w-full rounded-xl bg-white shadow-[0px_0px_30px_0px_rgba(0,0,0,0.04)]'>
        <div className='meeting-calendar-wrapper flex w-full justify-center'>
          <DatePicker
            locale={ko}
            inline
            onMonthChange={(date) => {
              setDisplayedMonth(date);
              setSelectedDate(null);
              setDetailMeetings(null);
              setActiveCardIndex(0);
            }}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => {
              return (
                <div className='flex items-center justify-center gap-1.5 p-4'>
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    type='button'
                    className='flex items-center justify-center text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-30'
                  >
                    <Icon name='arrow_prev' size={24} />
                  </button>
                  <span className='text-title-6 text-gray-800'>
                    {format(date, 'M월')}
                  </span>
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    type='button'
                    className='flex items-center justify-center text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-30'
                  >
                    <Icon name='arrow_next' size={24} />
                  </button>
                </div>
              );
            }}
            renderDayContents={renderDayContents}
            onChange={handleDateClick}
            calendarClassName='border-none! shadow-none! font-sans!'
            dayClassName={() => 'bg-transparent cursor-pointer'}
          />
        </div>
      </div>

      {/* Detail Card Section */}
      {isDetailLoading ? (
        <div className='flex items-center justify-center py-8'>
          <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600' />
        </div>
      ) : null}
      {showDetailCard ? (
        <div ref={detailRef} className='pb-8'>
          <MeetingDetailCard
            meetings={detailMeetings}
            selectedDate={selectedDate}
            currentIndex={activeCardIndex}
            onIndexChange={setActiveCardIndex}
          />
        </div>
      ) : null}
    </div>
  );
}
