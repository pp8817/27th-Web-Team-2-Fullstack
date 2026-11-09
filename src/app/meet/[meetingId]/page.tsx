import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';

import { buildVoteDateStats } from '@/entities/voteDateStat/lib/buildVoteDateStats';
import { selectRepresentativeDate } from '@/entities/voteDateStat/lib/selectRepresentativeDate';
import { ApiError } from '@/server/http';
import { readPublicMeeting } from '@/server/meeting/service';
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from '@/shared/config/constants';
import { BASE_URL } from '@/shared/config/constants';
import { getKoreaStandardTime } from '@/shared/lib/date';
import { ResultSummaryHeader } from '@/widgets/vote-result/ui/ResultSummaryHeader';
import { VoteResultDataView } from '@/widgets/vote-result/ui/VoteResultDataView';

import ParticipantHeader from './ParticipantHeader';
import { VoteActionButtons } from './VoteActionButtons';

const getCachedMeeting = cache(readPublicMeeting);

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { meetingId } = await params;

  try {
    const meetingData = await getCachedMeeting(meetingId);
    const title = `${meetingData.hostName}님이 초대한 ${meetingData.title}`;
    return {
      title,
      description: SITE_DESCRIPTION,
      openGraph: {
        title,
        description: SITE_DESCRIPTION,
        images: [OG_IMAGE],
      },
    };
  } catch {
    return {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      openGraph: {
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [OG_IMAGE],
      },
    };
  }
}

export default async function ResultPage({ params }: PageProps) {
  const { meetingId } = await params;
  const meetingData = await getCachedMeeting(meetingId).catch(
    (error: unknown) => {
      if (error instanceof ApiError && error.status === 404) notFound();
      throw error;
    },
  );
  if (meetingData.status === 'CONFIRMED' && meetingData.finalizedDate) {
    redirect(`/meet/${meetingId}/confirmed`);
  }

  const stats = buildVoteDateStats(meetingData.dates, meetingData.participants);
  const representativeDate = selectRepresentativeDate(stats);
  const votedCount = meetingData.participants.filter((participant) => {
    return participant.hasVoted;
  }).length;

  const sortedDates = [...meetingData.dates].sort();
  const openRange = {
    start: sortedDates[0],
    end: sortedDates[sortedDates.length - 1],
  };

  const participantNames = meetingData.participants.map((p) => p.name);

  const standardTime = getKoreaStandardTime();

  return (
    <div className='flex min-h-screen flex-col bg-gray-50 pt-14 pb-25'>
      <div className='bg-gray-0 fixed top-0 right-0 left-0 z-50 mx-auto w-full max-w-screen-sm'>
        <ParticipantHeader
          title={`${meetingData.hostName}님이 초대한 ${meetingData.title}`}
          url={`${BASE_URL}/meet/${meetingId}`}
          className='bg-gray-0'
        />
      </div>

      <ResultSummaryHeader
        votedCount={votedCount}
        representativeDate={representativeDate}
        standardTime={standardTime}
      />

      <VoteResultDataView
        participantNames={participantNames}
        openRange={openRange}
        stats={stats}
        hasVoted={votedCount > 0}
      />

      {meetingData.status === 'VOTING' && (
        <VoteActionButtons meetingId={meetingId} />
      )}
    </div>
  );
}
