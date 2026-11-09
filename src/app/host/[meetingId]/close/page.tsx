import HostClosePage from '@/features/host-close/ui/HostClosePage';

interface PageProps {
  params: Promise<{ meetingId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { meetingId } = await params;
  return <HostClosePage meetingId={meetingId} />;
}
