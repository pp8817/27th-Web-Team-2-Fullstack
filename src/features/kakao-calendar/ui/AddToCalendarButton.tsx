'use client';

import Button from '@/shared/ui/button/Button';
import Icon from '@/shared/ui/icon/Icon';

import type { KakaoCalendarEventRequest } from '../model/types';
import { useAddToCalendar } from '../model/useAddToCalendar';
import CalendarSuccessBottomSheet from './CalendarSuccessBottomSheet';

interface AddToCalendarButtonProps {
  request: KakaoCalendarEventRequest;
}

export default function AddToCalendarButton({
  request,
}: AddToCalendarButtonProps) {
  const { status, handleAdd, reset } = useAddToCalendar(request);

  return (
    <>
      <Button
        onClick={handleAdd}
        disabled={status === 'loading'}
        variant='secondary'
        fullWidth
      >
        <span className='flex items-center justify-center gap-2'>
          <Icon name='ic_calendar_add' size={20} />
          {status === 'loading' ? '등록 중...' : '알림받기'}
        </span>
      </Button>

      <CalendarSuccessBottomSheet
        isOpen={status === 'success'}
        onClose={reset}
      />
    </>
  );
}
