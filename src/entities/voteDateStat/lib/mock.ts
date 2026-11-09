import { type Participant } from '@/entities/meeting/dto/meet.dto';

interface VoteDateScenarioFixture {
  key: 'no-vote' | 'tie-first' | 'submit-success';
  meetingId: string;
  hostName: string;
  title: string;
  dates: string[];
  participants: Participant[];
}

export const VOTE_DATE_SCENARIO_FIXTURES: VoteDateScenarioFixture[] = [
  {
    key: 'no-vote',
    meetingId: 'fixture-no-vote',
    hostName: '모잇 팀',
    title: '무투표 시나리오',
    dates: ['2026-02-20', '2026-02-21', '2026-02-22'],
    participants: [
      {
        id: 1,
        name: '김철수',
        voteDates: [],
        hasVoted: false,
      },
      {
        id: 2,
        name: '박영희',
        voteDates: [],
        hasVoted: false,
      },
    ],
  },
  {
    key: 'tie-first',
    meetingId: 'fixture-tie-first',
    hostName: '모잇 팀',
    title: '동률 1위 시나리오',
    dates: ['2026-02-18', '2026-02-22', '2026-02-28'],
    participants: [
      {
        id: 1,
        name: '김철수',
        voteDates: ['2026-02-18', '2026-02-22'],
        hasVoted: true,
      },
      {
        id: 2,
        name: '박영희',
        voteDates: ['2026-02-18', '2026-02-22'],
        hasVoted: true,
      },
      {
        id: 3,
        name: '이민지',
        voteDates: ['2026-02-28'],
        hasVoted: true,
      },
    ],
  },
  {
    key: 'submit-success',
    meetingId: 'fixture-submit-success',
    hostName: '모잇 팀',
    title: '등록 완료 오버레이 시나리오',
    dates: ['2026-02-23', '2026-02-24', '2026-02-25'],
    participants: [
      {
        id: 1,
        name: '신규참여자',
        voteDates: ['2026-02-24'],
        hasVoted: true,
      },
    ],
  },
];
