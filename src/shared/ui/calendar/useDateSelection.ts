'use client';

import { parseISO } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import { formatDate } from '@/shared/lib/date';

import { toggleDatesSmart } from './dateUtils';

interface UseDateSelectionParams {
  initialDates?: string[]; // 'yyyy-MM-dd' 형식
}

export default function useDateSelection({
  initialDates = [],
}: UseDateSelectionParams = {}) {
  const [selectedDates, setSelectedDates] = useState<Date[]>(() =>
    initialDates.map((dateStr) => parseISO(dateStr)),
  );

  const formattedDates = useMemo(
    () => selectedDates.map((d) => formatDate(d)),
    [selectedDates],
  );

  const handleDateChange = useCallback((newDates: Date[]) => {
    setSelectedDates(newDates);
  }, []);

  const toggleDate = useCallback((date: Date) => {
    setSelectedDates((prev) => toggleDatesSmart(prev, [date]));
  }, []);

  return {
    selectedDates,
    formattedDates,
    handleDateChange,
    toggleDate,
    setSelectedDates,
  };
}
