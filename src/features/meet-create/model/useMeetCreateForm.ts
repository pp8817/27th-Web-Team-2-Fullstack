'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { getStoredUserInfo } from '@/shared/lib/storage';
import { validateHostName } from '@/shared/lib/validation';

const MEETING_NAME_PLACEHOLDERS = [
  '멋쟁이들 모임',
  '우리들의 약속',
  '즐거운 만남',
  '행복한 하루',
  '설레는 모임',
];

function getRandomPlaceholder() {
  return MEETING_NAME_PLACEHOLDERS[
    Math.floor(Math.random() * MEETING_NAME_PLACEHOLDERS.length)
  ];
}

interface UseMeetCreateFormParams {
  initialHostName?: string;
  initialMeetingName?: string;
}

export default function useMeetCreateForm({
  initialHostName = '',
  initialMeetingName = '',
}: UseMeetCreateFormParams = {}) {
  const router = useRouter();

  const [hostName, setHostName] = useState(initialHostName);
  const [hostNameError, setHostNameError] = useState('');
  const [meetingName, setMeetingName] = useState(initialMeetingName);
  const [meetingNamePlaceholder] = useState(getRandomPlaceholder);
  const [participantCount, setParticipantCount] = useState(2);

  useEffect(() => {
    if (!initialHostName) {
      const userInfo = getStoredUserInfo();
      if (userInfo?.name) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage는 SSR에서 접근 불가하므로 mount 후 1회 읽기가 필수
        setHostName(userInfo.name);
      }
    }
  }, [initialHostName]);

  const handleHostNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setHostName(value);
      setHostNameError(validateHostName(value));
    },
    [],
  );

  const handleHostNameClear = useCallback(() => {
    setHostName('');
    setHostNameError('');
  }, []);

  const handleMeetingNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMeetingName(e.target.value);
    },
    [],
  );

  const handleMeetingNameClear = useCallback(() => {
    setMeetingName('');
  }, []);

  const handleParticipantCountChange = useCallback((value: number) => {
    setParticipantCount(value);
  }, []);

  const isValid =
    hostName.trim() !== '' && hostNameError === '' && participantCount >= 1;

  const handleSubmit = useCallback(() => {
    if (!isValid) return;

    const trimmedHostName = hostName.trim();

    const params = new URLSearchParams({
      hostName: trimmedHostName,
      meetingName: meetingName.trim() || meetingNamePlaceholder,
      participantCount: String(participantCount),
    });

    router.push(`/date?${params.toString()}`);
  }, [
    isValid,
    hostName,
    meetingName,
    meetingNamePlaceholder,
    participantCount,
    router,
  ]);

  return {
    hostName,
    hostNameError,
    handleHostNameChange,
    handleHostNameClear,
    meetingName,
    meetingNamePlaceholder,
    handleMeetingNameChange,
    handleMeetingNameClear,
    participantCount,
    handleParticipantCountChange,
    isValid,
    handleSubmit,
  };
}
