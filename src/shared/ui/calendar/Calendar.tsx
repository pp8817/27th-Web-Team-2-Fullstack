'use client';

import 'react-datepicker/dist/react-datepicker.css';

import {
  endOfMonth,
  getMonth,
  isSameDay,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';

import { isOffDay } from '@/shared/lib/holiday';
import type { CalendarDateVariant } from '@/shared/ui/calendar-date/CalendarDate';
import CalendarDate from '@/shared/ui/calendar-date/CalendarDate';
import Icon from '@/shared/ui/icon/Icon';
import Tooltip from '@/shared/ui/tooltip/Tooltip';

import {
  generateDateRange,
  getNavigationLimits,
  isDateDisabled,
  toggleDatesSmart,
} from './dateUtils';

interface CalendarProps {
  selectedDates: Date[];
  onChange: (dates: Date[]) => void;
  availableDates?: Date[];
  showNextMonthTooltip?: boolean;
  className?: string;
}

interface DragState {
  startDate: Date | null;
  endDate: Date | null;
  isDragging: boolean;
}

export default function Calendar({
  selectedDates,
  onChange,
  availableDates,
  showNextMonthTooltip = false,
  className,
}: CalendarProps) {
  const { minDate: defaultMin, maxDate: defaultMax } = getNavigationLimits();

  // availableDates가 있으면 그 범위를 네비게이션 제한으로 사용
  const navigationLimits = React.useMemo(() => {
    if (!availableDates || availableDates.length === 0) {
      return { minDate: defaultMin, maxDate: defaultMax };
    }
    const sortedDates = [...availableDates].sort(
      (a, b) => a.getTime() - b.getTime(),
    );
    return {
      minDate: startOfMonth(sortedDates[0]),
      maxDate: endOfMonth(sortedDates[sortedDates.length - 1]),
    };
  }, [availableDates, defaultMin, defaultMax]);

  const { minDate, maxDate } = navigationLimits;
  const [displayedMonth, setDisplayedMonth] = useState(new Date());

  // 드래그 상태: ref는 이벤트 핸들러 내 즉시 참조, state는 UI 리렌더링용
  const dragRef = useRef<DragState>({
    startDate: null,
    endDate: null,
    isDragging: false,
  });
  const [dragState, setDragState] = useState<DragState>({
    startDate: null,
    endDate: null,
    isDragging: false,
  });
  const touchHandledRef = useRef(false);

  // 다음 달 툴팁
  const [isTooltipVisible, setIsTooltipVisible] =
    useState(showNextMonthTooltip);

  useEffect(() => {
    if (!showNextMonthTooltip) return;
    const timer = setTimeout(() => setIsTooltipVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [showNextMonthTooltip]);

  const isDateClickable = useCallback(
    (date: Date) => {
      if (isDateDisabled(date)) return false;
      if (availableDates) {
        return availableDates.some((d) => isSameDay(d, date));
      }
      return true;
    },
    [availableDates],
  );

  // DOM에서 날짜 셀 찾기
  const findDateFromElement = (target: EventTarget): Date | null => {
    let el = target as HTMLElement;

    while (el) {
      const ts = el.getAttribute('data-date-timestamp');
      if (ts) return startOfDay(new Date(parseInt(ts, 10)));

      const dateStr = el.getAttribute('data-date');
      if (dateStr) {
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) return startOfDay(parsed);
      }
      if (el.classList.contains('react-datepicker__day')) break;
      el = el.parentElement as HTMLElement;
    }

    if (el) {
      const inner =
        el.querySelector('[data-date-timestamp]') ||
        el.querySelector('[data-date]');
      if (inner) {
        const ts = inner.getAttribute('data-date-timestamp');
        if (ts) return startOfDay(new Date(parseInt(ts, 10)));
        const dateStr = inner.getAttribute('data-date');
        if (dateStr) {
          const parsed = new Date(dateStr);
          if (!isNaN(parsed.getTime())) return startOfDay(parsed);
        }
      }
    }

    return null;
  };

  // --- Touch 이벤트 핸들러 ---
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchHandledRef.current = true;
      const date = findDateFromElement(e.target as EventTarget);
      if (!date || !isDateClickable(date)) return;

      dragRef.current = { startDate: date, endDate: date, isDragging: true };
      setDragState({ startDate: date, endDate: date, isDragging: true });
    },
    [isDateClickable],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragRef.current.isDragging) return;

      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!el) return;

      const date = findDateFromElement(el);
      if (!date || !isDateClickable(date)) return;

      if (
        !dragRef.current.endDate ||
        !isSameDay(date, dragRef.current.endDate)
      ) {
        dragRef.current.endDate = date;
        setDragState((prev) => ({ ...prev, endDate: date }));
      }
    },
    [isDateClickable],
  );

  const handleTouchEnd = useCallback(() => {
    if (!dragRef.current.isDragging || !dragRef.current.startDate) return;

    const { startDate, endDate } = dragRef.current;
    const range = generateDateRange(startDate, endDate || startDate).filter(
      isDateClickable,
    );
    const result = toggleDatesSmart(selectedDates, range);
    onChange(result);

    dragRef.current = { startDate: null, endDate: null, isDragging: false };
    setDragState({ startDate: null, endDate: null, isDragging: false });

    setTimeout(() => {
      touchHandledRef.current = false;
    }, 300);
  }, [selectedDates, onChange, isDateClickable]);

  // --- Mouse 이벤트 핸들러 ---
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (touchHandledRef.current) return;

      const date = findDateFromElement(e.target as EventTarget);
      if (!date || !isDateClickable(date)) return;

      dragRef.current = { startDate: date, endDate: date, isDragging: true };
      setDragState({ startDate: date, endDate: date, isDragging: true });
    },
    [isDateClickable],
  );

  const handleMouseOver = useCallback(
    (e: React.MouseEvent) => {
      if (touchHandledRef.current || !dragRef.current.isDragging) return;

      const date = findDateFromElement(e.target as EventTarget);
      if (!date || !isDateClickable(date)) return;

      if (
        !dragRef.current.endDate ||
        !isSameDay(date, dragRef.current.endDate)
      ) {
        dragRef.current.endDate = date;
        setDragState((prev) => ({ ...prev, endDate: date }));
      }
    },
    [isDateClickable],
  );

  const handleMouseUp = useCallback(() => {
    if (touchHandledRef.current || !dragRef.current.isDragging) return;
    if (!dragRef.current.startDate) return;

    const { startDate, endDate } = dragRef.current;
    const range = generateDateRange(startDate, endDate || startDate).filter(
      isDateClickable,
    );
    const result = toggleDatesSmart(selectedDates, range);
    onChange(result);

    dragRef.current = { startDate: null, endDate: null, isDragging: false };
    setDragState({ startDate: null, endDate: null, isDragging: false });
  }, [selectedDates, onChange, isDateClickable]);

  // 드래그 중 미리보기 범위에 포함되는지 확인
  const isInDragRange = useCallback(
    (date: Date) => {
      if (!dragState.isDragging || !dragState.startDate || !dragState.endDate) {
        return false;
      }
      const range = generateDateRange(dragState.startDate, dragState.endDate);
      return range.some((d) => isSameDay(d, date));
    },
    [dragState],
  );

  const isSelected = useCallback(
    (date: Date) => selectedDates.some((d) => isSameDay(d, date)),
    [selectedDates],
  );

  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: {
    date: Date;
    decreaseMonth: () => void;
    increaseMonth: () => void;
    prevMonthButtonDisabled: boolean;
    nextMonthButtonDisabled: boolean;
  }) => (
    <div className='flex items-center justify-center gap-1.5 px-4 pb-2'>
      <button
        type='button'
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className='flex h-6 w-6 items-center justify-center disabled:opacity-30'
        aria-label='이전 달'
      >
        <Icon name='arrow_prev' size={24} color='var(--color-gray-200)' />
      </button>
      <span className='text-title-6 min-w-[60px] text-center text-gray-800'>
        {getMonth(date) + 1}월
      </span>
      {showNextMonthTooltip && !nextMonthButtonDisabled ? (
        <Tooltip
          message='다음 달도 투표할 수 있어요'
          visible={isTooltipVisible}
          className='z-50'
          triggerOnHover={false}
        >
          <button
            type='button'
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className='flex h-6 w-6 items-center justify-center disabled:opacity-30'
            aria-label='다음 달'
          >
            <Icon name='arrow_next' size={24} color='var(--color-gray-200)' />
          </button>
        </Tooltip>
      ) : (
        <button
          type='button'
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className='flex h-6 w-6 items-center justify-center disabled:opacity-30'
          aria-label='다음 달'
        >
          <Icon name='arrow_next' size={24} color='var(--color-gray-200)' />
        </button>
      )}
    </div>
  );

  const renderDayContents = (dayOfMonth: number, date: Date) => {
    const selected = isSelected(date);
    const disabled = !isDateClickable(date);
    const inDragRange = isInDragRange(date);
    const offDay = isOffDay(date);
    const isOutsideMonth = date.getMonth() !== displayedMonth.getMonth();

    // CalendarDate variant 결정
    let variant: CalendarDateVariant = 'default';
    if (isOutsideMonth && offDay) variant = 'other_holiday';
    else if (isOutsideMonth) variant = 'other';
    else if (disabled && offDay) variant = 'other_holiday';
    else if (disabled) variant = 'other';
    else if (selected) variant = 'selected';
    else if (inDragRange && offDay) variant = 'secondary_holiday';
    else if (inDragRange) variant = 'secondary';
    else if (offDay) variant = 'holiday';

    return (
      <span
        className='flex h-full w-full items-center justify-center select-none'
        data-date={date.toISOString()}
        data-date-timestamp={date.getTime()}
      >
        <CalendarDate day={dayOfMonth} variant={variant} />
      </span>
    );
  };

  const formatWeekDay = (nameOfDay: string) => {
    const dayMap: Record<string, string> = {
      일요일: '일',
      월요일: '월',
      화요일: '화',
      수요일: '수',
      목요일: '목',
      금요일: '금',
      토요일: '토',
    };
    return dayMap[nameOfDay] || nameOfDay.charAt(0);
  };

  return (
    <div
      className={`react-datepicker-wrapper-custom rounded-xl bg-white shadow-[0_0_30px_rgba(0,0,0,0.08)] ${className || ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <DatePicker
        inline
        locale={ko}
        selected={null}
        onChange={() => {}}
        minDate={minDate}
        maxDate={maxDate}
        renderCustomHeader={renderCustomHeader}
        renderDayContents={renderDayContents}
        formatWeekDay={formatWeekDay}
        calendarStartDay={0}
        openToDate={new Date()}
        onMonthChange={setDisplayedMonth}
        disabledKeyboardNavigation
      />
    </div>
  );
}
