interface DateVoteCount {
  date: string;
  count: number;
}

export function calculateRank(
  stats: DateVoteCount[],
  targetDate: string,
): number | null {
  if (!targetDate || stats.length === 0) {
    return null;
  }

  const target = stats.find((stat) => stat.date === targetDate);

  if (!target || target.count <= 0) {
    return null;
  }

  const sorted = [...stats].sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }

    return a.date.localeCompare(b.date);
  });

  const rankByDate = new Map<string, number>();
  let currentRank = 1;

  sorted.forEach((item, index) => {
    if (index > 0 && item.count < sorted[index - 1].count) {
      currentRank = index + 1;
    }

    rankByDate.set(item.date, currentRank);
  });

  return rankByDate.get(targetDate) ?? null;
}
