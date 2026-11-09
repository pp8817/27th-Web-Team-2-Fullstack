'use client';

import { useRouter } from 'next/navigation';

import { logout } from '@/entities/auth/api/session';
import { clearStoredUserInfo } from '@/shared/lib/storage';
import ConfirmBottomSheet from '@/shared/ui/bottom-sheet/ConfirmBottomSheet';

interface LogoutBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  hostName: string;
}

export default function LogoutBottomSheet({
  isOpen,
  onClose,
  hostName,
}: LogoutBottomSheetProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      clearStoredUserInfo();
      onClose();
      router.replace('/');
    } catch {
      alert('로그아웃에 실패했습니다. 다시 시도해 주세요.');
    }
  }

  return (
    <ConfirmBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title='정말 로그아웃하시겠어요?'
      description={`${hostName}님의 계정이 로그아웃 돼요.`}
      confirmLabel='로그아웃'
      onConfirm={handleLogout}
    />
  );
}
