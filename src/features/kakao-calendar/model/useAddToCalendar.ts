'use client';

import { useCallback, useState } from 'react';

import { trackEvent } from '@/shared/lib/amplitude';

import { createCalendarEvent } from '../api/kakao-calendar';
import type { KakaoCalendarEventRequest } from './types';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function useAddToCalendar(request: KakaoCalendarEventRequest | null) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = useCallback(async () => {
    if (!request) return;

    trackEvent('calendar_add_click');
    setStatus('loading');
    setError(null);

    try {
      await createCalendarEvent(request);
      setStatus('success');
      trackEvent('calendar_add_success');
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Unknown error');
      trackEvent('calendar_add_error');
    }
  }, [request]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { status, error, handleAdd, reset };
}
