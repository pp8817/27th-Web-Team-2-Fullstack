'use client';

import { useRouter } from 'next/navigation';

import useMeetCreateForm from '@/features/meet-create/model/useMeetCreateForm';
import Button from '@/shared/ui/button/Button';
import Input from '@/shared/ui/input/Input';
import NumberStepper from '@/shared/ui/number-stepper/NumberStepper';
import TopBar from '@/shared/ui/top-bar/TopBar';

interface MeetCreatePageProps {
  initialHostName?: string;
  initialMeetingName?: string;
}

export default function MeetCreatePage({
  initialHostName = '',
  initialMeetingName = '',
}: MeetCreatePageProps) {
  const router = useRouter();

  const {
    hostName,
    hostNameError,
    handleHostNameChange,
    handleHostNameClear,
    meetingName,
    meetingNamePlaceholder,
    handleMeetingNameChange,
    handleMeetingNameClear,
    handleParticipantCountChange,
    isValid,
    handleSubmit,
  } = useMeetCreateForm({
    initialHostName,
    initialMeetingName,
  });

  return (
    <div className='flex min-h-dvh flex-col'>
      <TopBar
        title='모임 만들기'
        leftIcon='arrow_prev'
        onLeftClick={() => router.back()}
      />

      <div className='px-5 pt-6'>
        <h2 className='text-headline-6 text-text-primary'>
          청첩장 모임을 만들어볼까요?
        </h2>
      </div>

      <div className='flex flex-1 flex-col px-5 pt-8'>
        <Input
          label='모임장 이름'
          required
          placeholder='이름을 입력해주세요'
          maxLength={10}
          value={hostName}
          onChange={handleHostNameChange}
          onClear={handleHostNameClear}
          errorMessage={hostNameError}
          autoFocus
          autoComplete='off'
          fullWidth
        />

        <Input
          label='모임명'
          placeholder={meetingNamePlaceholder}
          maxLength={10}
          value={meetingName}
          onChange={handleMeetingNameChange}
          onClear={handleMeetingNameClear}
          fullWidth
          suppressHydrationWarning
        />

        <div className='mt-3.5 flex items-center justify-between py-1'>
          <div className='flex items-start gap-0.5'>
            <span className='text-title-8 text-gray-600'>투표 인원</span>
            <div className='bg-error-default mt-[3px] h-[3px] w-[3px] rounded-full' />
          </div>
          <NumberStepper
            defaultValue={1}
            max={999}
            onChange={handleParticipantCountChange}
          />
        </div>

        <div className='flex-1' />

        <div className='pb-10'>
          <Button fullWidth disabled={!isValid} onClick={handleSubmit}>
            날짜 선택하기
          </Button>
        </div>
      </div>
    </div>
  );
}
