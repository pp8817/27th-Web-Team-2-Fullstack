import type { MeetingCardData } from '@/features/meeting-card/model/types';

export type Tab = {
  label: string;
  href: string;
  hasAlert?: boolean;
};

export const TABS: Tab[] = [
  { label: '투표중', href: '/list', hasAlert: true },
  { label: '확정된 일정', href: '/list/calendar' },
];

export const MOCK_MEETINGS: MeetingCardData[] = [
  {
    id: '1',
    title: '디자인팀 회식',
    dDay: 3,
    currentVotes: 4,
    totalVotes: 6,
    topDate: '2월 18일 화요일',
  },
  {
    id: '2',
    title: '프론트엔드 스터디',
    dDay: 5,
    currentVotes: 2,
    totalVotes: 8,
    topDate: '2월 20일 목요일',
  },
  {
    id: '3',
    title: '동창회 모임',
    dDay: 7,
    currentVotes: 6,
    totalVotes: 10,
    topDate: '2월 22일 토요일',
  },
  {
    id: '4',
    title: '프로젝트 킥오프',
    dDay: 2,
    currentVotes: 3,
    totalVotes: 5,
    topDate: '2월 17일 월요일',
  },
  {
    id: '5',
    title: '북클럽 정기모임',
    dDay: 10,
    currentVotes: 0,
    totalVotes: 4,
    topDate: '미정',
  },
];
