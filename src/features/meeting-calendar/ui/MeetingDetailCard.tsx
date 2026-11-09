'use client';

import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useAddToCalendar } from '@/features/kakao-calendar/model/useAddToCalendar';
import CalendarSuccessBottomSheet from '@/features/kakao-calendar/ui/CalendarSuccessBottomSheet';
import { buildMeetingCalendarUrl } from '@/shared/lib/googleCalendar';
import AttendanceGroup from '@/shared/ui/attendance-group/AttendanceGroup';
import LinkShareBottomSheet from '@/shared/ui/bottom-sheet/LinkShareBottomSheet';
import Icon from '@/shared/ui/icon/Icon';

import type { ConfirmedMeeting } from '../model/types';

type MeetingDetailCardProps = {
  meetings: ConfirmedMeeting[];
  selectedDate: string;
  currentIndex: number;
  onIndexChange: (index: number) => void;
};

const variants: Variants = {
  enter: (direction: 'left' | 'right') => ({
    x: direction === 'right' ? -100 : 100,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'left' | 'right') => ({
    zIndex: 0,
    x: direction === 'right' ? 40 : -40,
    opacity: 0,
    transition: {
      x: { type: 'tween', duration: 0.1 },
      opacity: { duration: 0.08 },
    },
  }),
};

export default function MeetingDetailCard({
  meetings,
  selectedDate,
  currentIndex,
  onIndexChange,
}: MeetingDetailCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>(
    'left',
  );

  const meeting = meetings[currentIndex];
  const hasMultiple = meetings.length > 1;

  const handleNext = useCallback(() => {
    setSlideDirection('left');
    onIndexChange((currentIndex + 1) % meetings.length);
  }, [currentIndex, meetings.length, onIndexChange]);

  const handlePrev = useCallback(() => {
    setSlideDirection('right');
    onIndexChange((currentIndex - 1 + meetings.length) % meetings.length);
  }, [currentIndex, meetings.length, onIndexChange]);

  /* Drag handling via Pointer Events */
  const startX = useRef(0);
  const endX = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  const handleDragEnd = useCallback(() => {
    const diff = startX.current - endX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  }, [handleNext, handlePrev]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    startX.current = e.clientX;
    endX.current = e.clientX;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      endX.current = e.clientX;
    },
    [isDragging],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      if (isDragging) {
        setIsDragging(false);
        handleDragEnd();
      }
    },
    [isDragging, handleDragEnd],
  );

  const calendarRequest = useMemo(
    () =>
      meeting
        ? { meetId: meeting.id, eventDate: meeting.date, title: meeting.title }
        : null,
    [meeting],
  );
  const {
    status: calendarStatus,
    handleAdd,
    reset,
  } = useAddToCalendar(calendarRequest);

  if (!meeting) return null;

  const dateObj = parseISO(selectedDate);
  const formattedDate = format(dateObj, 'M월 d일 EEEE', { locale: ko });

  return (
    <div className='flex flex-col items-center gap-2'>
      {/* Detail Card */}
      <div
        ref={cardRef}
        className={`relative w-full overflow-hidden rounded-[12px] shadow-[0px_0px_30px_0px_rgba(0,0,0,0.04)] ${hasMultiple ? 'touch-pan-y' : ''}`}
        onPointerDown={hasMultiple ? handlePointerDown : undefined}
        onPointerMove={hasMultiple ? handlePointerMove : undefined}
        onPointerUp={hasMultiple ? handlePointerUp : undefined}
        onPointerCancel={hasMultiple ? handlePointerUp : undefined}
      >
        <AnimatePresence mode='wait' custom={slideDirection}>
          <motion.div
            key={currentIndex}
            custom={slideDirection}
            variants={variants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{
              x: { type: 'spring', stiffness: 500, damping: 35 },
              opacity: { duration: 0.06 },
            }}
            className='w-full'
          >
            {/* Dark Header Bar */}
            <div className='flex items-center justify-between rounded-t-[10px] bg-gray-600 px-3.5 py-2'>
              <div className='flex items-center gap-1.5'>
                <Icon name='ic_letter' size={18} color='white' />
                <span className='text-body-4 text-text-inverse'>
                  {meeting.title}
                </span>
              </div>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareSheetOpen(true);
                }}
                aria-label='링크 공유'
              >
                <Icon name='ic_other_share' size={18} color='white' />
              </button>
            </div>

            {/* Content Area */}
            <div className='flex flex-col gap-3.5 bg-white p-5'>
              {/* Header - date + count */}
              <div className='flex flex-col gap-1.5'>
                <span className='text-caption-7 text-gray-600'>
                  {formattedDate}
                </span>
                <p className='text-title-6 text-gray-900'>
                  <span className='text-primary-subtle'>
                    {meeting.attendees.length}
                  </span>
                  명이 함께할 수 있어요
                </p>
              </div>

              {/* Divider */}
              <div className='h-px w-full bg-gray-100' />

              {/* Attendance sections */}
              <div className='flex flex-col gap-4'>
                <AttendanceGroup type='can' participants={meeting.attendees} />
                <AttendanceGroup
                  type='cannot'
                  participants={meeting.absentees}
                />
              </div>

              {/* Memo Section */}
              {meeting.memo ? (
                <>
                  <div className='h-px w-full bg-gray-100' />
                  <div className='flex flex-col gap-2'>
                    <span className='text-title-8'>메모</span>
                    <p className='text-body-4 text-text-secondary break-all whitespace-pre-wrap'>
                      {meeting.memo}
                    </p>
                  </div>
                </>
              ) : null}
            </div>

            {/* Action Buttons Footer */}
            <div className='flex items-center rounded-b-[12px] border-t border-gray-100 bg-white py-3.5'>
              <button
                type='button'
                className='flex flex-1 items-center justify-center gap-1.5'
                onClick={() => {
                  const url = buildMeetingCalendarUrl({
                    title: meeting.title,
                    date: meeting.date,
                    attendees: meeting.attendees,
                    absentees: meeting.absentees,
                    memo: meeting.memo,
                  });
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                <Icon
                  name='ic_calendar'
                  size={16}
                  color='var(--color-text-secondary)'
                />
                <span className='text-body-4 text-text-secondary'>
                  구글캘린더 등록
                </span>
              </button>
              <div className='h-5 w-px bg-gray-100' />
              <button
                type='button'
                className='flex flex-1 items-center justify-center gap-1.5'
                onClick={handleAdd}
                disabled={calendarStatus === 'loading'}
              >
                <Icon
                  name='ic_bell'
                  size={16}
                  color='var(--color-text-secondary)'
                />
                <span className='text-body-4 text-text-secondary'>
                  {calendarStatus === 'loading'
                    ? '등록 중...'
                    : '카톡 알림 받기'}
                </span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <CalendarSuccessBottomSheet
        isOpen={calendarStatus === 'success'}
        onClose={reset}
      />

      <LinkShareBottomSheet
        isOpen={isShareSheetOpen}
        onClose={() => setIsShareSheetOpen(false)}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/meet/${meeting.id}/confirmed`}
        title='확정된 모임 링크를 공유해요!'
        description='친구들에게 확정된 날짜를 알려보세요'
        shareTitle={meeting.title}
      />

      {/* Dot indicator for multi-meeting */}
      {hasMultiple ? (
        <div className='flex items-center gap-1.5'>
          {meetings.map((_, index) => (
            <div
              key={meetings[index].id}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                index === currentIndex ? 'bg-gray-700' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
