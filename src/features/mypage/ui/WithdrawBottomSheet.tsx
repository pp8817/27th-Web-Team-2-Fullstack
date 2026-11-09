'use client';

import ConfirmBottomSheet from '@/shared/ui/bottom-sheet/ConfirmBottomSheet';

interface WithdrawBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawBottomSheet({
  isOpen,
  onClose,
}: WithdrawBottomSheetProps) {
  return (
    <ConfirmBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title='정말 탈퇴하시겠어요?'
      description='소중한 정보가 모두 사라지고 되돌릴 수 없어요.'
      confirmLabel='탈퇴하기'
      onConfirm={() => console.log('withdraw')}
    />
  );
}
