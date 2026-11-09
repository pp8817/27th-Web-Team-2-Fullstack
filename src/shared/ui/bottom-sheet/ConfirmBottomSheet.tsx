'use client';

import BottomSheet from '@/shared/ui/bottom-sheet/BottomSheet';
import Button from '@/shared/ui/button/Button';

interface ConfirmBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

export default function ConfirmBottomSheet({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel,
  cancelLabel = '돌아가기',
  onConfirm,
}: ConfirmBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className='flex flex-col items-center pt-6 pb-1'>
        <h3 className='text-headline-5 text-text-primary text-center'>
          {title}
        </h3>
        <p className='text-body-2 text-text-tertiary mt-1 mb-5 text-center'>
          {description}
        </p>
        <div className='mt-4 flex w-full gap-[10px]'>
          <Button fullWidth variant='secondary' onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button fullWidth variant='dark' onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
