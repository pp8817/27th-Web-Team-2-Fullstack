import { isHoliday } from 'korean-holidays';

const holidayCache = new Map<string, boolean>();

export const isOffDay = (date: Date): boolean => {
  const cacheKey = date.toDateString();
  if (holidayCache.has(cacheKey)) return holidayCache.get(cacheKey)!;

  const isSunday = date.getDay() === 0;
  const result = isSunday || !!isHoliday(date);
  holidayCache.set(cacheKey, result);
  return result;
};
