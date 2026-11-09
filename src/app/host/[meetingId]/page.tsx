import { Metadata } from 'next';

import { HostMeetingProvider } from '@/entities/host/model/HostMeetingContext';
import { readPublicMeeting } from '@/server/meeting/service';
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from '@/shared/config/constants';

import HostActionButtons from './HostActionButtons';
import HostMemoSection from './HostMemoSection';
import HostVoteHeader from './HostVoteHeader';
import HostVoteResultSection from './HostVoteResultSection';

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
    const meetingData = await readPublicMeeting(meetingId);
    const title = meetingData.title;
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

export default async function HostVoteDetailPage({ params }: PageProps) {
  const { meetingId } = await params;

  return (
    <HostMeetingProvider meetingId={meetingId}>
      <div className='flex min-h-screen flex-col bg-gray-50 pt-14 pb-25'>
        <div className='bg-gray-0 fixed top-0 right-0 left-0 z-50 mx-auto w-full max-w-screen-sm'>
          <HostVoteHeader className='bg-gray-0' />
        </div>

        <HostVoteResultSection />

        <HostMemoSection />

        <HostActionButtons />
      </div>
    </HostMeetingProvider>
  );
}
