'use client';

import useDateSelect from '@/features/meet-create-date/model/useDateSelect';
import PostCreateLoginSheet from '@/features/post-create-login-sheet/ui/PostCreateLoginSheet';
import Button from '@/shared/ui/button/Button';
import Calendar from '@/shared/ui/calendar/Calendar';
import TopBar from '@/shared/ui/top-bar/TopBar';

export default function DateSelectPage() {
  const {
    selectedDates,
    handleDateChange,
    isValid,
    handleSubmit,
    handleBack,
    isSheetOpen,
    handleSheetClose,
    onKakaoLogin,
    onGoogleLogin,
  } = useDateSelect();

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <TopBar
        title='모임 만들기'
        leftIcon='arrow_prev'
        onLeftClick={handleBack}
        className='border-b border-gray-100'
      />

      <div className='flex flex-1 flex-col'>
        {/* 헤더 영역 */}
        <div className='px-5 pt-6 pb-2'>
          <h2 className='text-title-4 text-text-primary'>
            어떤 날이 좋으신가요?
          </h2>
          <p className='text-body-5 text-text-tertiary mt-1'>
            참여자들은 선택한 날짜 중에서 투표할 수 있어요.
          </p>
        </div>

        {/* 캘린더 영역 */}
        <div className='px-5 pt-2'>
          <Calendar selectedDates={selectedDates} onChange={handleDateChange} />
        </div>

        <div className='flex-1' />

        {/* CTA 버튼 영역 - 상단 페이드 그라데이션 */}
        <div className='sticky bottom-0 px-5 pt-4 pb-10 shadow-[0_-7px_20px_10px_var(--color-gray-50)]'>
          <Button
            variant='dark'
            fullWidth
            disabled={!isValid}
            onClick={handleSubmit}
          >
            모임 만들기
          </Button>
        </div>
      </div>

      <PostCreateLoginSheet
        isOpen={isSheetOpen}
        onClose={handleSheetClose}
        onKakaoLogin={onKakaoLogin}
        onGoogleLogin={onGoogleLogin}
      />
    </div>
  );
}
