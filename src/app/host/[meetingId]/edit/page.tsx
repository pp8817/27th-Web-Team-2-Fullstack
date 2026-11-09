import { Metadata } from 'next';

import MeetEditPage from '@/features/meet-edit/ui/MeetEditPage';

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '모임 수정하기',
  };
}

export default async function EditMeetingPage({ params }: PageProps) {
  const { meetingId } = await params;

  return <MeetEditPage meetingId={meetingId} />;
}
