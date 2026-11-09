import {
  addDays,
  endOfMonth,
  isBefore,
  isSameDay,
  startOfMonth,
  startOfToday,
} from 'date-fns';

/**
 * 오늘 이전 날짜인지 확인 (오늘은 포함하지 않음)
 */
export const isDateDisabled = (date: Date): boolean => {
  return isBefore(date, startOfToday());
};

/**
 * 캘린더 네비게이션 범위 계산
 * 현재 달 시작 ~ 내년 2월 말
 */
export const getNavigationLimits = () => {
  const today = startOfToday();
  const minDate = startOfMonth(today);
  const maxDate = endOfMonth(new Date(today.getFullYear() + 1, 1, 1));
  return { minDate, maxDate };
};

/**
 * start~end 사이의 모든 날짜 배열 생성 (역방향도 지원)
 */
export const generateDateRange = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  let current = new Date(start);
  const loopEnd = new Date(end);

  current.setHours(0, 0, 0, 0);
  loopEnd.setHours(0, 0, 0, 0);

  if (current > loopEnd) {
    const temp = new Date(current);
    current = new Date(loopEnd);
    loopEnd.setTime(temp.getTime());
  }

  while (current <= loopEnd) {
    dates.push(new Date(current));
    current = addDays(current, 1);
  }
  return dates;
};

/**
 * 스마트 토글: 새 범위의 첫 번째 날짜가 이미 선택됨 → 범위 해제, 미선택 → 범위 추가
 */
export const toggleDatesSmart = (
  currentSelection: Date[],
  newRange: Date[],
): Date[] => {
  if (newRange.length === 0) return currentSelection;

  const firstDate = newRange[0];
  const isFirstSelected = currentSelection.some((d) => isSameDay(d, firstDate));

  let nextSelection: Date[];

  if (isFirstSelected) {
    nextSelection = currentSelection.filter(
      (existing) => !newRange.some((nr) => isSameDay(nr, existing)),
    );
  } else {
    nextSelection = [...currentSelection];
    newRange.forEach((nr) => {
      if (!nextSelection.some((existing) => isSameDay(existing, nr))) {
        nextSelection.push(nr);
      }
    });
  }

  return nextSelection.sort((a, b) => a.getTime() - b.getTime());
};
