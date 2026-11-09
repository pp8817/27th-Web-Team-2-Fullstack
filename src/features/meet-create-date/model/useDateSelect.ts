'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

import { createMeeting } from '@/entities/meeting/api/createMeeting';
import useSocialLogin from '@/features/social-login/model/useSocialLogin';
import { DOMAIN_TARGET_MAP } from '@/shared/config/constants';
import { getStoredUserInfo } from '@/shared/lib/storage';
import useDateSelection from '@/shared/ui/calendar/useDateSelection';

const PENDING_MEETING_KEY = 'pending_meeting';

export default function useDateSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hostName = searchParams.get('hostName') || '';
  const meetingName = searchParams.get('meetingName') || '';
  const participantCount = searchParams.get('participantCount') || '2';

  const { selectedDates, formattedDates, handleDateChange } =
    useDateSelection();

  const { handleKakaoLogin, handleGoogleLogin } = useSocialLogin();

  const isValid = selectedDates.length > 0;

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!isValid) return;

    const userInfo = getStoredUserInfo();

    if (userInfo) {
      try {
        const meetingData = {
          title: meetingName,
          hostName,
          maxParticipantCount: Number(participantCount),
          dates: formattedDates,
        };
        await createMeeting(meetingData);
        router.replace('/list');
      } catch (error) {
        console.error('[useDateSelect] 모임 생성 실패:', error);
        alert('모임 생성에 실패했습니다. 다시 시도해 주세요.');
      }
    } else {
      setIsSheetOpen(true);
    }
  }, [
    isValid,
    meetingName,
    hostName,
    participantCount,
    formattedDates,
    router,
  ]);

  const savePendingMeeting = useCallback(() => {
    const meetingData = {
      title: meetingName,
      hostName,
      dates: formattedDates,
      maxParticipantCount: Number(participantCount),
    };
    sessionStorage.setItem(PENDING_MEETING_KEY, JSON.stringify(meetingData));
  }, [meetingName, hostName, formattedDates, participantCount]);

  const onKakaoLogin = useCallback(() => {
    handleKakaoLogin(DOMAIN_TARGET_MAP.list, savePendingMeeting);
  }, [handleKakaoLogin, savePendingMeeting]);

  const onGoogleLogin = useCallback(() => {
    handleGoogleLogin(DOMAIN_TARGET_MAP.list, savePendingMeeting);
  }, [handleGoogleLogin, savePendingMeeting]);

  const handleSheetClose = useCallback(() => {
    setIsSheetOpen(false);
  }, []);

  const handleBack = useCallback(() => {
    const params = new URLSearchParams({
      hostName,
      meetingName,
    });
    router.replace(`/create?${params.toString()}`);
  }, [router, hostName, meetingName]);

  return {
    hostName,
    meetingName,
    participantCount,
    selectedDates,
    formattedDates,
    handleDateChange,
    isValid,
    handleSubmit,
    handleBack,
    isSheetOpen,
    handleSheetClose,
    onKakaoLogin,
    onGoogleLogin,
  };
}
