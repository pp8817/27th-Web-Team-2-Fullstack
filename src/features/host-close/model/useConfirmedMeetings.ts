import { useEffect, useState } from 'react';

import { getConfirmedDashboard } from '@/entities/host/api/getConfirmedDashboard';
import type { MeetingDashboardCard } from '@/entities/host/dto/dashboard.dto';

export function useConfirmedMeetings() {
  const [confirmedMeetings, setConfirmedMeetings] = useState<
    MeetingDashboardCard[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    getConfirmedDashboard(controller.signal)
      .then((data) => {
        setConfirmedMeetings(data.meetings);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Error fetching confirmed dashboard:', err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return { confirmedMeetings, isLoading };
}
