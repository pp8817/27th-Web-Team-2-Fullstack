'use client';

import { useCallback, useState } from 'react';

import { useHostMeeting } from '@/entities/host/model/HostMeetingContext';
import { buildVoteDateStats } from '@/entities/voteDateStat/lib/buildVoteDateStats';
import { selectRepresentativeDate } from '@/entities/voteDateStat/lib/selectRepresentativeDate';
import { getKoreaStandardTime } from '@/shared/lib/date';
import { HostVoteStatusHeader } from '@/widgets/vote-result/ui/HostVoteStatusHeader';
import { VoteResultDataView } from '@/widgets/vote-result/ui/VoteResultDataView';

export default function HostVoteResultSection() {
  const { data, isLoading, refetch } = useHostMeeting();
  const [timeString, setTimeString] = useState(() => getKoreaStandardTime());

  const handleRefresh = useCallback(() => {
    refetch();
    setTimeString(getKoreaStandardTime());
  }, [refetch]);

  if (isLoading || !data) {
    return (
      <div className='flex min-h-75 items-center justify-center'>
        <p className='text-gray-500'>로딩 중...</p>
      </div>
    );
  }

  const stats = buildVoteDateStats(data.dates, data.participants);
  const representativeDate = selectRepresentativeDate(stats);
  const votedCount = data.participants.filter((participant) => {
    return participant.hasVoted;
  }).length;
  const notVotedCount =
    data.notVotedParticipantCount ??
    (data.maxParticipantCount
      ? data.maxParticipantCount - votedCount
      : data.participants.length - votedCount);

  const sortedDates = [...data.dates].sort();
  const openRange = {
    start: sortedDates[0],
    end: sortedDates[sortedDates.length - 1],
  };

  const participantNames = data.participants.map((p) => p.name);

  return (
    <>
      <HostVoteStatusHeader
        notVotedCount={notVotedCount}
        votedCount={votedCount}
        representativeDate={representativeDate}
        standardTime={timeString}
        onRefresh={handleRefresh}
      />
      <VoteResultDataView
        participantNames={participantNames}
        openRange={openRange}
        stats={stats}
        hasVoted={votedCount > 0}
      />
    </>
  );
}
