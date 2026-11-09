import { type Metadata } from 'next';

import ParticipantRegisterDatePage from '@/features/participant-register-date/ui/ParticipantRegisterDatePage';

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { meetingId } = await params;

  return {
    title: `일정 투표하기 - ${meetingId}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { meetingId } = await params;

  return <ParticipantRegisterDatePage meetingId={meetingId} />;
}
