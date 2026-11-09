import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { buildVoteDateStats } from '@/entities/voteDateStat/lib/buildVoteDateStats';
import { ParticipantConfirmedView } from '@/features/vote-results-calendar/ui/ParticipantConfirmedView';
import { ApiError } from '@/server/http';
import { readPublicMeeting } from '@/server/meeting/service';
import { OG_IMAGE, SITE_DESCRIPTION } from '@/shared/config/constants';

const getCachedMeeting = cache((meetingId: string) =>
  readPublicMeeting(meetingId),
);

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
    const meeting = await getCachedMeeting(meetingId);
    const title = `${meeting.hostName}님이 초대한 ${meeting.title}`;
    return {
      title,
      description: SITE_DESCRIPTION,
      openGraph: { title, description: SITE_DESCRIPTION, images: [OG_IMAGE] },
    };
  } catch {
    return { title: '확정된 모임' };
  }
}

export default async function ConfirmedPage({ params }: PageProps) {
  const { meetingId } = await params;

  let meeting;
  try {
    meeting = await getCachedMeeting(meetingId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  if (!meeting.finalizedDate) {
    notFound();
  }

  const stats = buildVoteDateStats(meeting.dates, meeting.participants);

  return (
    <ParticipantConfirmedView
      hostName={meeting.hostName ?? ''}
      meetingId={meetingId}
      confirmedDate={meeting.finalizedDate}
      stats={stats}
    />
  );
}
