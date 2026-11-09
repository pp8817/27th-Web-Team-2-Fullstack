'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getHostMeeting } from '@/entities/host/api/getHostMeeting';
import { HostMeetingResponse } from '@/entities/host/dto/host.dto';

export type HostMeetingContextValue = {
  data: HostMeetingResponse | null;
  isLoading: boolean;
  meetingId: string;
  refetch: () => void;
};

const HostMeetingContext = createContext<HostMeetingContextValue | null>(null);

export function HostMeetingProvider({
  meetingId,
  children,
}: {
  meetingId: string;
  children: ReactNode;
}) {
  const [data, setData] = useState<HostMeetingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHostMeeting(meetingId)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error('getHostMeeting Error:', err);
        alert('모임 정보를 불러오는 데 실패했습니다.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [meetingId]);

  const refetch = useCallback(() => {
    getHostMeeting(meetingId)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error('getHostMeeting Error:', err);
      });
  }, [meetingId]);

  const value = useMemo(
    () => ({ data, isLoading, meetingId, refetch }),
    [data, isLoading, meetingId, refetch],
  );

  return (
    <HostMeetingContext.Provider value={value}>
      {children}
    </HostMeetingContext.Provider>
  );
}

export function useHostMeeting() {
  const context = useContext(HostMeetingContext);
  if (!context) {
    throw new Error('useHostMeeting must be used within HostMeetingProvider');
  }
  return context;
}
