'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { updateMeeting } from '@/entities/host/api/updateMeeting';
import { getMeetingById } from '@/entities/meeting/api/getMeetingById';
import type { Participant } from '@/entities/meeting/dto/meet.dto';
import { formatDate, parseDate } from '@/shared/lib/date';

import {
  validateMeetName,
  validateParticipantCount,
} from '../lib/meetEditValidation';

interface OriginalData {
  title: string;
  maxParticipantCount: number | null;
  dates: string[];
  participantIds: number[];
}

export default function useMeetEditForm(meetingId: string) {
  const router = useRouter();

  const [original, setOriginal] = useState<OriginalData | null>(null);
  const [title, setTitle] = useState('');
  const [maxParticipantCount, setMaxParticipantCount] = useState<number | null>(
    null,
  );
  const [dates, setDates] = useState<Date[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [removedParticipantNames, setRemovedParticipantNames] = useState<
    string[]
  >([]);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnsavedBottomSheetOpen, setIsUnsavedBottomSheetOpen] =
    useState(false);

  useEffect(() => {
    async function loadMeeting() {
      try {
        const data = await getMeetingById(meetingId);
        setTitle(data.title);
        setMaxParticipantCount(data.maxParticipantCount);
        setDates(data.dates.map((d) => parseDate(d)));
        setParticipants(data.participants);
        setOriginal({
          title: data.title,
          maxParticipantCount: data.maxParticipantCount,
          dates: [...data.dates].sort(),
          participantIds: data.participants.map((p) => p.id),
        });
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadMeeting();
  }, [meetingId]);

  const titleError = useMemo(
    () => (isNameEditing ? validateMeetName(title) : ''),
    [title, isNameEditing],
  );

  const countError = useMemo(
    () => validateParticipantCount(maxParticipantCount, participants.length),
    [maxParticipantCount, participants.length],
  );

  const hasChanges = useMemo(() => {
    if (!original) return false;
    const currentDates = dates.map((d) => formatDate(d)).sort();
    return (
      title !== original.title ||
      maxParticipantCount !== original.maxParticipantCount ||
      JSON.stringify(currentDates) !== JSON.stringify(original.dates) ||
      removedParticipantNames.length > 0
    );
  }, [title, maxParticipantCount, dates, removedParticipantNames, original]);

  const isValid = useMemo(() => {
    return (
      validateMeetName(title) === '' &&
      (maxParticipantCount === null ||
        maxParticipantCount >= participants.length)
    );
  }, [title, maxParticipantCount, participants.length]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    [],
  );

  const handleTitleClear = useCallback(() => {
    setTitle('');
  }, []);

  const handleStartNameEditing = useCallback(() => {
    setIsNameEditing(true);
  }, []);

  const handleParticipantCountChange = useCallback((value: number) => {
    setMaxParticipantCount(value);
  }, []);

  const handleRemoveParticipant = useCallback(
    (participantId: number) => {
      const target = participants.find((p) => p.id === participantId);
      if (target) {
        setRemovedParticipantNames((prev) => [...prev, target.name]);
        setParticipants((prev) => prev.filter((p) => p.id !== participantId));
      }
    },
    [participants],
  );

  const handleDatesChange = useCallback((newDates: Date[]) => {
    setDates(newDates);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isValid || !hasChanges || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateMeeting({
        meetingId,
        title: title.trim(),
        maxParticipantCount: maxParticipantCount ?? undefined,
        dates: dates.map((d) => formatDate(d)),
        removedParticipantNames,
      });
      router.replace(`/host/${meetingId}`);
      router.refresh();
    } catch {
      setIsSubmitting(false);
      alert('모임 수정에 실패했습니다.');
    }
  }, [
    isValid,
    hasChanges,
    isSubmitting,
    meetingId,
    title,
    maxParticipantCount,
    dates,
    removedParticipantNames,
    router,
  ]);

  const handleBack = useCallback(() => {
    if (hasChanges) {
      setIsUnsavedBottomSheetOpen(true);
    } else {
      router.back();
    }
  }, [hasChanges, router]);

  const handleConfirmStay = useCallback(() => {
    setIsUnsavedBottomSheetOpen(false);
  }, []);

  const handleConfirmLeave = useCallback(() => {
    setIsUnsavedBottomSheetOpen(false);
    router.back();
  }, [router]);

  return {
    title,
    maxParticipantCount,
    dates,
    participants,
    removedParticipantNames,
    isNameEditing,
    isLoading,
    isError,
    isSubmitting,
    titleError,
    countError,
    hasChanges,
    isValid,
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
  };
}
