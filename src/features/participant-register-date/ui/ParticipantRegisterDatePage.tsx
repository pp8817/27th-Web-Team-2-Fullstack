'use client';

import { trackEvent } from '@/shared/lib/amplitude';
import Button from '@/shared/ui/button/Button';
import Calendar from '@/shared/ui/calendar/Calendar';
import Checkbox from '@/shared/ui/checkbox/Checkbox';
import { Header } from '@/shared/ui/header/Header';
import TopBar from '@/shared/ui/top-bar/TopBar';

import { useParticipantRegisterDate } from '../model/useParticipantRegisterDate';
import VoteCompleteOverlay from './VoteCompleteOverlay';

interface ParticipantRegisterDatePageProps {
  meetingId: string;
}

export default function ParticipantRegisterDatePage({
  meetingId,
}: ParticipantRegisterDatePageProps) {
  const {
    isLoading,
    // meetingTitle, // 필요 시 사용
    availableDates,
    selectedDates,
    isAllImpossible,
    // isSubmitting,
    isCtaActive,
    handleAllImpossibleChange,
    onDateClick,
    handleBack,
    handleSubmit,
    isSuccessOverlayOpen,
    handleSuccessOverlayConfirm,
    successOverlaySubtitle,
  } = useParticipantRegisterDate(meetingId);

  const handleDateChangeWithTracking = (dates: Date[]) => {
    trackEvent('voter_date_vote', {
      vote_type: dates.length > 0 ? 'selective' : 'all_disabled',
    });
    onDateClick(dates);
  };

  const handleSubmitWithTracking = () => {
    trackEvent('voter_vote_cta_click');
    handleSubmit();
  };

  const handleSuccessOverlayConfirmWithTracking = () => {
    trackEvent('voter_vote_completed_cta_click');
    handleSuccessOverlayConfirm();
  };

  if (isLoading) {
    return (
      <div className='bg-gray-0 flex min-h-screen items-center justify-center'>
        <div className='text-body-4 text-text-secondary'>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className='bg-gray-0 relative flex min-h-screen flex-col'>
      {/* 2-1. 상단 영역 */}
      <TopBar
        title='일정 투표하기'
        leftIcon='arrow_prev'
        onLeftClick={handleBack}
      />
      <Header
        variant='subHeader'
        title={'참석 가능한 날짜를\n모두 선택해주세요'}
      />

      <main className='flex flex-1 flex-col px-5 pt-1 pb-10'>
        <div className='relative w-full pb-3'>
          <Calendar
            selectedDates={selectedDates}
            onChange={handleDateChangeWithTracking}
            availableDates={availableDates}
            showNextMonthTooltip={true}
            className='w-full'
          />
        </div>

        {/* 2-4. '모든 날짜에 참여가 어려워요' 체크박스 */}
        <div className='mb-6'>
          <div
            className='flex cursor-pointer items-center gap-2'
            onClick={() => handleAllImpossibleChange(!isAllImpossible)}
          >
            <Checkbox
              checked={isAllImpossible}
              onChange={() => {}} // 부모 div onClick으로 처리
            />
            <span className='text-body-4 text-text-secondary select-none'>
              모든 날짜에 참여가 어려워요
            </span>
          </div>
        </div>

        <div className='flex-1' />

        {/* 2-5. CTA 영역 */}
        <Button
          onClick={handleSubmitWithTracking}
          disabled={!isCtaActive}
          fullWidth
        >
          투표하기
        </Button>
      </main>

      <VoteCompleteOverlay
        isOpen={isSuccessOverlayOpen}
        title={'투표가 완료되었어요!'}
        subtitle={successOverlaySubtitle}
        onConfirm={handleSuccessOverlayConfirmWithTracking}
      />
    </div>
  );
}
