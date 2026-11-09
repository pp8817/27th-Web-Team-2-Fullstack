import type { Participant } from '@/entities/voteDateStat/dto/voteDateStat.dto';

export type { Participant };

export type ConfirmedMeeting = {
  id: string;
  title: string;
  date: string; // 'yyyy-MM-dd'
  attendees: Participant[]; // 올 수 있는 사람
  absentees: Participant[]; // 못 오는 사람
  memo?: string | null;
};

/** 캘린더 label용 경량 타입 (하위 호환) */
export type MeetingLabel = {
  id: string;
  title: string;
  date: string; // 'yyyy-MM-dd'
};

export type MeetingCalendarProps = {
  meetings: MeetingLabel[];
  fetchMeetingDetails?: (meetingIds: string[]) => Promise<ConfirmedMeeting[]>;
  className?: string;
};
