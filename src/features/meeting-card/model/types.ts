export type MeetingCardData = {
  id: string;
  title: string;
  dDay: number | null; // e.g., 2 means "D-2", null means no leading date
  currentVotes: number;
  totalVotes: number;
  topDate: string; // e.g., "1월 29일 토요일"
};

export type MeetingCardProps = {
  meeting: MeetingCardData;
  className?: string;
};
