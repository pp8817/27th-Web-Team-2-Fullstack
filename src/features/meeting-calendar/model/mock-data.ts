import type { ConfirmedMeeting } from './types';

export const MOCK_CONFIRMED_MEETINGS: ConfirmedMeeting[] = [
  {
    id: 'm1',
    title: '동네친구아아아',
    date: '2026-02-13',
    attendees: [
      { id: 'a1', name: '예딘공쥬' },
      { id: 'a2', name: '이름이' },
      { id: 'a3', name: '김철수' },
    ],
    absentees: [{ id: 'b1', name: '냐옹' }],
  },
  {
    id: 'm2',
    title: '동네친구',
    date: '2026-02-13',
    attendees: [{ id: 'c1', name: '조쭝니' }],
    absentees: [
      { id: 'd1', name: '박영희' },
      { id: 'd2', name: '최민지' },
    ],
  },
  {
    id: 'm3',
    title: '회식',
    date: '2026-02-20',
    attendees: [
      { id: 'e1', name: '홍길동' },
      { id: 'e2', name: '이순신' },
      { id: 'e3', name: '세종대왕' },
      { id: 'e4', name: '장영실' },
    ],
    absentees: [],
  },
];
