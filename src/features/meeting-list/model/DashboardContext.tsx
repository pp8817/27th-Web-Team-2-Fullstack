'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { getConfirmedDashboard } from '@/entities/host/api/getConfirmedDashboard';
import { getInProgressDashboard } from '@/entities/host/api/getInProgressDashboard';
import type {
  ConfirmedDashboardResponse,
  InProgressDashboardResponse,
} from '@/entities/host/dto/dashboard.dto';

interface DashboardState {
  inProgress: InProgressDashboardResponse | null;
  confirmed: ConfirmedDashboardResponse | null;
  isInProgressLoading: boolean;
  isConfirmedLoading: boolean;
  confirmedRequested: boolean;
  fetchConfirmed: () => void;
  refetchInProgress: () => void;
  refetchConfirmed: () => void;
}

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [inProgress, setInProgress] =
    useState<InProgressDashboardResponse | null>(null);
  const [confirmed, setConfirmed] = useState<ConfirmedDashboardResponse | null>(
    null,
  );
  const [isInProgressLoading, setIsInProgressLoading] = useState(true);
  const [isConfirmedLoading, setIsConfirmedLoading] = useState(false);
  const [confirmedRequested, setConfirmedRequested] = useState(false);
  const confirmedFetchedRef = useRef(false);

  useEffect(() => {
    getInProgressDashboard()
      .then((res) => {
        setInProgress(res);
      })
      .catch((err) => {
        console.error('getInProgressDashboard Error:', err);
        alert('모임 목록을 불러오는 데 실패했습니다.');
      })
      .finally(() => {
        setIsInProgressLoading(false);
      });
  }, []);

  const fetchConfirmed = useCallback(() => {
    if (confirmedFetchedRef.current) return;
    confirmedFetchedRef.current = true;
    setConfirmedRequested(true);
    setIsConfirmedLoading(true);
    getConfirmedDashboard()
      .then((res) => {
        setConfirmed(res);
      })
      .catch((err) => {
        console.error('getConfirmedDashboard Error:', err);
        alert('확정 모임 목록을 불러오는 데 실패했습니다.');
        confirmedFetchedRef.current = false;
      })
      .finally(() => {
        setIsConfirmedLoading(false);
      });
  }, []);

  const refetchInProgress = useCallback(() => {
    getInProgressDashboard()
      .then((res) => {
        setInProgress(res);
      })
      .catch((err) => {
        console.error('getInProgressDashboard Error:', err);
      });
  }, []);

  const refetchConfirmed = useCallback(() => {
    if (confirmedFetchedRef.current) {
      getConfirmedDashboard()
        .then((res) => {
          setConfirmed(res);
        })
        .catch((err) => {
          console.error('getConfirmedDashboard Error:', err);
        });
    }
  }, []);

  const value = useMemo(
    () => ({
      inProgress,
      confirmed,
      isInProgressLoading,
      isConfirmedLoading,
      confirmedRequested,
      fetchConfirmed,
      refetchInProgress,
      refetchConfirmed,
    }),
    [
      inProgress,
      confirmed,
      isInProgressLoading,
      isConfirmedLoading,
      confirmedRequested,
      fetchConfirmed,
      refetchInProgress,
      refetchConfirmed,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}

export function useInProgressDashboard() {
  const { inProgress, isInProgressLoading, refetchInProgress } = useDashboard();
  return {
    data: inProgress,
    isLoading: isInProgressLoading,
    refetch: refetchInProgress,
  };
}

export function useConfirmedDashboard(options?: { lazy?: boolean }) {
  const {
    confirmed,
    isConfirmedLoading,
    confirmedRequested,
    fetchConfirmed,
    refetchConfirmed,
  } = useDashboard();

  useEffect(() => {
    if (!options?.lazy) {
      fetchConfirmed();
    }
  }, [options?.lazy, fetchConfirmed]);

  // lazy 모드: 아직 요청 안 됐으면 로딩 아님 (데이터 없는 게 정상)
  // fetch 모드: 요청됐지만 데이터 없으면 로딩 중
  const isLoading = options?.lazy
    ? isConfirmedLoading
    : confirmedRequested
      ? isConfirmedLoading
      : true;

  return { data: confirmed, isLoading, refetch: refetchConfirmed };
}
