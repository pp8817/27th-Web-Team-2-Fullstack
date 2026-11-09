'use client';

import BottomSheet from '@/shared/ui/bottom-sheet/BottomSheet';
import Button from '@/shared/ui/button/Button';
import Icon from '@/shared/ui/icon/Icon';

interface CalendarSuccessBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarSuccessBottomSheet({
  isOpen,
  onClose,
}: CalendarSuccessBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className='flex flex-col items-center justify-center px-1 pt-6'>
        <Icon
          name='ic_circle_check_filled'
          size={48}
          className='text-primary-default mb-4'
        />
        <div className='mb-5 flex flex-col items-center gap-1 text-center'>
          <h2 className='text-headline-5 text-text-primary'>
            일정이 등록되었어요
          </h2>
          <p className='text-body-2 text-text-tertiary'>
            카카오톡 캘린더에서 확인할 수 있어요
          </p>
        </div>
        <Button onClick={onClose} fullWidth>
          확인
        </Button>
      </div>
    </BottomSheet>
  );
}
