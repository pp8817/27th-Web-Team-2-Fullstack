import { useEffect, useState } from 'react';

import { getHostMeeting } from '@/entities/host/api/getHostMeeting';
import type { HostMeetingResponse } from '@/entities/host/dto/host.dto';

export function useHostClose(meetingId: string) {
  const [hostMeeting, setHostMeeting] = useState<HostMeetingResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getHostMeeting(meetingId)
      .then((data) => {
        setHostMeeting(data);
      })
      .catch((err) => {
        console.error('Error fetching data for close page:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [meetingId]);

  return { hostMeeting, isLoading, error };
}
