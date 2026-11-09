'use client';

import copy from 'copy-to-clipboard';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { finalizeMeeting } from '@/entities/host/api/finalizeMeeting';
import { buildVoteDateStats } from '@/entities/voteDateStat/lib/buildVoteDateStats';
import { useConfirmedMeetings } from '@/features/host-close/model/useConfirmedMeetings';
import { useHostClose } from '@/features/host-close/model/useHostClose';
import MeetingDateConfirmationCard from '@/features/meeting-card/ui/MeetingDateConfirmationCard';
import VoteCompleteOverlay from '@/features/participant-register-date/ui/VoteCompleteOverlay';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import BottomSheet from '@/shared/ui/bottom-sheet/BottomSheet';
import Button from '@/shared/ui/button/Button';
import TopBar from '@/shared/ui/top-bar/TopBar';

interface HostClosePageProps {
  meetingId: string;
}

export default function HostClosePage({ meetingId }: HostClosePageProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isSuccessOverlayOpen, setIsSuccessOverlayOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const oneConflictSheet = useDisclosure();
  const twoConflictSheet = useDisclosure();

  const {
    hostMeeting,
    isLoading: isHostMeetingLoading,
    error,
  } = useHostClose(meetingId);
  const { confirmedMeetings, isLoading: isConfirmedLoading } =
    useConfirmedMeetings();

  const isLoading = isHostMeetingLoading || isConfirmedLoading;

  if (isLoading) {
    return (
      <div className='flex min-h-dvh items-center justify-center bg-gray-50'>
        <div className='text-body-2 text-text-tertiary'>로딩 중...</div>
      </div>
    );
  }

  if (error || !hostMeeting) {
    return (
      <div className='flex min-h-dvh flex-col bg-gray-50'>
        <TopBar
          title='모임 마감하기'
          leftIcon='arrow_prev'
          onLeftClick={() => router.back()}
        />
        <div className='flex flex-1 items-center justify-center px-5'>
          <p className='text-body-2 text-text-tertiary text-center'>
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    );
  }

  // 전체 vote stats에서 dense ranking으로 상위 3순위 후보 날짜 계산
  const allStats = buildVoteDateStats(
    hostMeeting.dates,
    hostMeeting.participants,
  );

  const hasNoVotesAtAll = allStats.every((s) => s.can.length === 0);

  let candidateDates: {
    date: string;
    attendeeCount: number;
    attendees: string[];
    rank: number;
  }[] = [];

  if (hasNoVotesAtAll) {
    candidateDates = allStats
      .map((s) => ({
        date: s.date,
        attendeeCount: 0,
        attendees: [],
        rank: 1,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } else {
    const sortedStats = allStats
      .filter((s) => s.can.length > 0)
      .sort(
        (a, b) => b.can.length - a.can.length || a.date.localeCompare(b.date),
      );

    const rankByDate = new Map<string, number>();
    let currentRank = 1;
    sortedStats.forEach((item, index) => {
      if (index > 0 && item.can.length < sortedStats[index - 1].can.length) {
        currentRank++;
      }
      rankByDate.set(item.date, currentRank);
    });

    candidateDates = sortedStats
      .map((s) => ({
        date: s.date,
        attendeeCount: s.can.length,
        attendees: s.can.map((p) => p.name),
        rank: rankByDate.get(s.date) ?? 99,
      }))
      .filter((item) => item.rank <= 3);
  }

  // 선택된 날짜와 기존 확정 모임을 비교해 겹치는 횟수를 계산
  const existingMeetingsCount = selectedDate
    ? confirmedMeetings.filter((m) => m.finalizedDate === selectedDate).length
    : 0;

  const handleConfirmClick = () => {
    if (!selectedDate) return;

    if (existingMeetingsCount >= 2) {
      twoConflictSheet.open();
    } else if (existingMeetingsCount === 1) {
      oneConflictSheet.open();
    } else {
      handleFinalConfirm();
    }
  };

  const handleCopyConfirmedLink = () => {
    copy(`${window.location.origin}/meet/${meetingId}/confirmed`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFinalConfirm = async () => {
    if (!selectedDate || isFinalizing) return;

    try {
      setIsFinalizing(true);
      await finalizeMeeting({ meetingId, finalizedDate: selectedDate });
      oneConflictSheet.close();
      twoConflictSheet.close();
      setIsSuccessOverlayOpen(true);
    } catch (err) {
      console.error('Failed to finalize meeting:', err);
      alert('모임 확정에 실패했습니다.');
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div className='relative flex min-h-dvh flex-col bg-gray-50'>
      <TopBar
        title='모임 마감하기'
        leftIcon='arrow_prev'
        onLeftClick={() => router.back()}
      />

      {/* 헤더 */}
      <div className='px-5 pt-6 pb-2'>
        <h2 className='text-title-4 text-text-primary'>
          모임 날짜를 확정해주세요
        </h2>
        <p className='text-body-5 text-text-tertiary mt-1'>
          후보 날짜 중 한 개의 날짜만 선택할 수 있어요
        </p>
      </div>

      {/* 후보 날짜 카드 목록 */}
      <div className='flex flex-col gap-2 px-5 py-2.5 pb-32'>
        {candidateDates.map((candidate) => (
          <MeetingDateConfirmationCard
            key={candidate.date}
            date={candidate.date}
            rank={candidate.rank}
            isSelected={selectedDate === candidate.date}
            attendeeCount={candidate.attendeeCount}
            attendees={candidate.attendees}
            onClick={() => setSelectedDate(candidate.date)}
          />
        ))}
      </div>

      {/* 하단 고정 확정 버튼 */}
      <div className='bg-gray-0 fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-screen-sm px-5 py-4 shadow-[0px_-7px_20px_10px_var(--color-gray-0)]'>
        <Button
          variant='dark'
          fullWidth
          onClick={handleConfirmClick}
          disabled={!selectedDate || isFinalizing}
        >
          {isFinalizing
            ? '확정 중...'
            : selectedDate
              ? `${selectedDate}로 할게요`
              : '날짜를 선택해주세요'}
        </Button>
      </div>

      {/* 1개 충돌 바텀시트: 날짜에 모임이 1개 있는 경우 */}
      <BottomSheet
        isOpen={oneConflictSheet.isOpen}
        onClose={oneConflictSheet.close}
      >
        <div className='flex flex-col items-center pt-6 pb-1'>
          <h3 className='text-headline-5 text-text-primary text-center'>
            이미 한 개의 모임이 있어요
          </h3>
          <p className='text-body-2 text-text-tertiary mt-1 mb-6 text-center'>
            하루에 두 개까지 등록할 수 있어요. 확정하시겠어요?
          </p>
          <Button
            variant='dark'
            fullWidth
            onClick={handleFinalConfirm}
            disabled={isFinalizing}
          >
            {isFinalizing ? '확정 중...' : '일정을 확정할게요'}
          </Button>
        </div>
      </BottomSheet>

      {/* 2개 충돌 바텀시트: 날짜에 모임이 이미 2개인 경우 */}
      <BottomSheet
        isOpen={twoConflictSheet.isOpen}
        onClose={twoConflictSheet.close}
      >
        <div className='flex flex-col items-center pt-6 pb-1'>
          <h3 className='text-headline-5 text-text-primary text-center'>
            이미 두 개의 모임이 있어요
          </h3>
          <p className='text-body-2 text-text-tertiary mt-1 mb-6 text-center'>
            하루에 두 개까지 등록할 수 있어요. 확정하시겠어요?
          </p>
          <Button variant='dark' fullWidth onClick={twoConflictSheet.close}>
            다른 날로 골라볼게요
          </Button>
        </div>
      </BottomSheet>
      <VoteCompleteOverlay
        isOpen={isSuccessOverlayOpen}
        title={'투표가 마감되었어요!'}
        subtitle={'아래 버튼을 눌러 내 일정을 쉽게 기억해 보세요'}
        confirmText={isCopied ? '링크 복사 완료' : '확정된 날짜 공유하기'}
        onConfirm={handleCopyConfirmedLink}
        onClose={() => {
          router.replace('/list/calendar');
        }}
      />
    </div>
  );
}
