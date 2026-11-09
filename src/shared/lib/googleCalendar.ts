interface GoogleCalendarEventOptions {
  title: string;
  date: string; // 'yyyy-MM-dd'
  details?: string;
}

/**
 * Google Calendar 이벤트 생성 URL을 빌드합니다.
 * 종일 이벤트로 생성됩니다.
 *
 * @example
 * buildGoogleCalendarUrl({ title: '청첩장 모임', date: '2026-03-24' })
 * // https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=20260324/20260325
 */
export function buildGoogleCalendarUrl({
  title,
  date,
  details,
}: GoogleCalendarEventOptions): string {
  const startDate = date.replace(/-/g, '');

  // 종일 이벤트: 종료일은 시작일 다음날 (Google Calendar exclusive end)
  const [year, month, day] = date.split('-').map(Number);
  const endDateObj = new Date(year, month - 1, day + 1);
  const endDate = [
    endDateObj.getFullYear(),
    String(endDateObj.getMonth() + 1).padStart(2, '0'),
    String(endDateObj.getDate()).padStart(2, '0'),
  ].join('');

  const params = new URLSearchParams({
    text: title,
    dates: `${startDate}/${endDate}`,
  });

  if (details) params.set('details', details);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
}

interface MeetingCalendarOptions {
  title: string;
  date: string; // 'yyyy-MM-dd'
  attendees: { name: string }[];
  absentees: { name: string }[];
  memo?: string | null;
}

/**
 * 모임 참석자 정보를 포함한 Google Calendar 이벤트 생성 URL을 빌드합니다.
 */
export function buildMeetingCalendarUrl({
  title,
  date,
  attendees,
  absentees,
  memo,
}: MeetingCalendarOptions): string {
  const lines = [
    `참석 가능 (${attendees.length}명): ${attendees.map((p) => p.name).join(', ')}`,
    `참석 불가 (${absentees.length}명): ${absentees.map((p) => p.name).join(', ')}`,
  ];
  if (memo) lines.push(`\n메모: ${memo}`);

  return buildGoogleCalendarUrl({
    title,
    date,
    details: lines.join('\n'),
  });
}
