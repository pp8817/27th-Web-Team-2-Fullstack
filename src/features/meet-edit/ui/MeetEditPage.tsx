'use client';

import useMeetEditForm from '@/features/meet-edit/model/useMeetEditForm';
import ConfirmBottomSheet from '@/shared/ui/bottom-sheet/ConfirmBottomSheet';
import Button from '@/shared/ui/button/Button';
import Calendar from '@/shared/ui/calendar/Calendar';
import TopBar from '@/shared/ui/top-bar/TopBar';

import MeetNameEditor from './MeetNameEditor';
import ParticipantManager from './ParticipantManager';

interface MeetEditPageProps {
  meetingId: string;
}

export default function MeetEditPage({ meetingId }: MeetEditPageProps) {
  const {
    title,
    maxParticipantCount,
    dates,
    participants,
    isNameEditing,
    isLoading,
    isError,
    isValid,
    isSubmitting,
    hasChanges,
    titleError,
    countError,
    handleTitleChange,
    handleTitleClear,
    handleStartNameEditing,
    handleParticipantCountChange,
    handleRemoveParticipant,
    handleDatesChange,
    isUnsavedBottomSheetOpen,
    handleSubmit,
    handleBack,
    handleConfirmStay,
    handleConfirmLeave,
  } = useMeetEditForm(meetingId);

  return (
    <div className='flex min-h-dvh flex-col'>
      <TopBar
        title='모임 수정하기'
        leftIcon='arrow_prev'
        onLeftClick={handleBack}
      />

      {isLoading ? (
        <div className='flex flex-1 items-center justify-center'>
          <p className='text-body-3 text-gray-400'>불러오는 중...</p>
        </div>
      ) : isError ? (
        <div className='flex flex-1 items-center justify-center'>
          <p className='text-body-3 text-gray-400'>
            모임 정보를 불러올 수 없어요
          </p>
        </div>
      ) : (
        <div className='flex flex-1 flex-col px-5'>
          <div className='pt-6 pb-2'>
            <MeetNameEditor
              title={title}
              isEditing={isNameEditing}
              onStartEditing={handleStartNameEditing}
              onTitleChange={handleTitleChange}
              onClear={handleTitleClear}
              errorMessage={titleError}
            />
          </div>

          <div className='flex flex-col gap-6'>
            <ParticipantManager
              participantCount={maxParticipantCount}
              participants={participants}
              onCountChange={handleParticipantCountChange}
              onRemoveParticipant={handleRemoveParticipant}
              countError={countError}
            />

            <div className='flex flex-col gap-1.5'>
              <div className='flex items-start gap-0.5'>
                <span className='text-title-8 text-gray-600'>투표 날짜</span>
                <div className='bg-error-default mt-0.75 h-0.75 w-0.75 rounded-full' />
              </div>
              <Calendar selectedDates={dates} onChange={handleDatesChange} />
            </div>
          </div>

          <div className='flex-1' />

          <div className='pb-28' />
          <div className='bg-gray-0 fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-screen-sm px-5 py-4 shadow-[0px_-7px_20px_10px_var(--color-gray-0)]'>
            <Button
              fullWidth
              disabled={!isValid || !hasChanges || isSubmitting}
              onClick={handleSubmit}
            >
              수정하기
            </Button>
          </div>
        </div>
      )}

      <ConfirmBottomSheet
        isOpen={isUnsavedBottomSheetOpen}
        onClose={handleConfirmLeave}
        title='잠깐~! 저장되지 않았어요'
        description='지금 나가면 수정한 내용이 저장되지 않아요'
        confirmLabel='계속 수정하기'
        cancelLabel='나가기'
        onConfirm={handleConfirmStay}
      />
    </div>
  );
}
