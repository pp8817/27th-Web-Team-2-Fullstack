'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

import { createMeeting } from '@/entities/meeting/api/createMeeting';
import { CreateMeetRequest } from '@/entities/meeting/dto/meet.dto';
import { getUser } from '@/entities/user/api/getUser';
import { setStoredUserInfo } from '@/shared/lib/storage';

const PENDING_MEETING_KEY = 'pending_meeting';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get('state');
  const targetPath = state?.includes('|') ? state.split('|')[1] : state;

  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const processPendingMeeting = async () => {
      try {
        const user = await getUser();
        setStoredUserInfo(user);
      } catch {
        alert('유저 정보를 불러오는 데 실패했습니다. 다시 로그인해 주세요.');
        router.replace('/');
        return;
      }

      const pendingMeetingData = sessionStorage.getItem(PENDING_MEETING_KEY);

      if (pendingMeetingData) {
        try {
          const meetingData: CreateMeetRequest = JSON.parse(pendingMeetingData);
          await createMeeting(meetingData);
          sessionStorage.removeItem(PENDING_MEETING_KEY);
        } catch (error) {
          console.error('모임 생성 실패:', error);
          sessionStorage.removeItem(PENDING_MEETING_KEY);
        }
      }

      if (targetPath === 'list') {
        router.replace('/list');
      } else if (targetPath === 'mypage') {
        router.replace('/mypage');
      } else if (targetPath === 'create') {
        router.replace('/create');
      } else {
        router.replace('/');
      }
    };

    processPendingMeeting();
  }, [router, targetPath]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackContent />
    </Suspense>
  );
}
