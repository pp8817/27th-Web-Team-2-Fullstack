import { differenceInCalendarDays } from 'date-fns';

import { type VoteDateStat } from '@/entities/voteDateStat/dto/voteDateStat.dto';
import { parseDate } from '@/shared/lib/date';

interface DateCandidate {
  date: string;
  distanceFromToday: number;
}

function getTimezoneAnchorDate(timeZone: string, now: Date) {
  const zonedNow = new Date(now.toLocaleString('en-US', { timeZone }));

  return new Date(
    zonedNow.getFullYear(),
    zonedNow.getMonth(),
    zonedNow.getDate(),
  );
}

export function selectRepresentativeDate(
  stats: VoteDateStat[],
  options?: {
    now?: Date;
    timeZone?: string;
  },
): string | null {
  if (stats.length === 0) {
    return null;
  }

  const maxCanCount = Math.max(...stats.map((stat) => stat.can.length));

  if (maxCanCount <= 0) {
    return null;
  }

  const topRankDates = stats.filter((stat) => {
    return stat.can.length === maxCanCount;
  });

  if (topRankDates.length === 1) {
    return topRankDates[0].date;
  }

  const timeZone = options?.timeZone ?? 'Asia/Seoul';
  const now = options?.now ?? new Date();
  const anchorDate = getTimezoneAnchorDate(timeZone, now);

  const candidates = topRankDates
    .map((stat) => {
      const targetDate = parseDate(stat.date);

      return {
        date: stat.date,
        distanceFromToday: Math.abs(
          differenceInCalendarDays(targetDate, anchorDate),
        ),
      } satisfies DateCandidate;
    })
    .sort((a, b) => {
      if (a.distanceFromToday !== b.distanceFromToday) {
        return a.distanceFromToday - b.distanceFromToday;
      }

      return a.date.localeCompare(b.date);
    });

  return candidates[0]?.date ?? null;
}
