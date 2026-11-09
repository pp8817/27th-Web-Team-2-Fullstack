import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import type { VoteDateStat } from '@/entities/voteDateStat/dto/voteDateStat.dto';

import { ReactDatePickerVoteResultsCalendar } from './ReactDatepicker';

const meta: Meta<typeof ReactDatePickerVoteResultsCalendar> = {
  title: 'Features/VoteResultsCalendar',
  component: ReactDatePickerVoteResultsCalendar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='mx-auto w-full max-w-screen-sm bg-gray-50 p-4'>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ReactDatePickerVoteResultsCalendar>;

const MOCK_STATS: VoteDateStat[] = [
  {
    date: '2026-02-13',
    can: [
      { id: 'p1', name: '예딘공쥬' },
      { id: 'p2', name: '조쭝니' },
      { id: 'p3', name: '김철수' },
      { id: 'p4', name: '박영희' },
    ],
    cannot: [{ id: 'p5', name: '냐옹' }],
  },
  {
    date: '2026-02-14',
    can: [
      { id: 'p1', name: '예딘공쥬' },
      { id: 'p2', name: '조쭝니' },
      { id: 'p3', name: '김철수' },
    ],
    cannot: [
      { id: 'p4', name: '박영희' },
      { id: 'p5', name: '냐옹' },
    ],
  },
  {
    date: '2026-02-15',
    can: [
      { id: 'p1', name: '예딘공쥬' },
      { id: 'p5', name: '냐옹' },
    ],
    cannot: [
      { id: 'p2', name: '조쭝니' },
      { id: 'p3', name: '김철수' },
      { id: 'p4', name: '박영희' },
    ],
  },
  {
    date: '2026-02-20',
    can: [
      { id: 'p1', name: '예딘공쥬' },
      { id: 'p2', name: '조쭝니' },
      { id: 'p3', name: '김철수' },
      { id: 'p4', name: '박영희' },
      { id: 'p5', name: '냐옹' },
    ],
    cannot: [],
  },
  {
    date: '2026-02-21',
    can: [{ id: 'p2', name: '조쭝니' }],
    cannot: [
      { id: 'p1', name: '예딘공쥬' },
      { id: 'p3', name: '김철수' },
      { id: 'p4', name: '박영희' },
      { id: 'p5', name: '냐옹' },
    ],
  },
];

/** 기본 - 투표 결과가 있는 캘린더 (1~3위 랭킹 표시) */
export const Default: Story = {
  args: {
    openRange: { start: '2026-02-01', end: '2026-02-28' },
    stats: MOCK_STATS,
  },
};

/** 특정 참여자 필터링 - '예딘공쥬'가 가능한 날짜만 하이라이트 */
export const FocusedParticipant: Story = {
  args: {
    openRange: { start: '2026-02-01', end: '2026-02-28' },
    stats: MOCK_STATS,
    focusedParticipant: '예딘공쥬',
  },
};

/** 2개월에 걸친 투표 범위 */
export const TwoMonthRange: Story = {
  args: {
    openRange: { start: '2026-02-15', end: '2026-03-15' },
    stats: [
      ...MOCK_STATS,
      {
        date: '2026-03-05',
        can: [
          { id: 'p1', name: '예딘공쥬' },
          { id: 'p2', name: '조쭝니' },
          { id: 'p3', name: '김철수' },
        ],
        cannot: [
          { id: 'p4', name: '박영희' },
          { id: 'p5', name: '냐옹' },
        ],
      },
      {
        date: '2026-03-10',
        can: [
          { id: 'p1', name: '예딘공쥬' },
          { id: 'p4', name: '박영희' },
        ],
        cannot: [
          { id: 'p2', name: '조쭝니' },
          { id: 'p3', name: '김철수' },
          { id: 'p5', name: '냐옹' },
        ],
      },
    ],
  },
};

/** 투표가 하나만 있는 경우 */
export const SingleVote: Story = {
  args: {
    openRange: { start: '2026-02-01', end: '2026-02-28' },
    stats: [MOCK_STATS[0]],
  },
};

/** 무투표 상태 - 모든 후보 날짜의 can 배열이 비어 있음 */
export const NoVote: Story = {
  args: {
    openRange: { start: '2026-02-01', end: '2026-02-28' },
    stats: [
      {
        date: '2026-02-13',
        can: [],
        cannot: [
          { id: 'p1', name: '예딘공쥬' },
          { id: 'p2', name: '조쭝니' },
        ],
      },
      {
        date: '2026-02-14',
        can: [],
        cannot: [
          { id: 'p1', name: '예딘공쥬' },
          { id: 'p2', name: '조쭝니' },
        ],
      },
    ],
  },
};

/** 동률 1위 상태 - 2개 날짜가 동일한 최다 득표 */
export const TieFirst: Story = {
  args: {
    openRange: { start: '2026-02-01', end: '2026-02-28' },
    stats: [
      {
        date: '2026-02-20',
        can: [
          { id: 'p1', name: '예딘공쥬' },
          { id: 'p2', name: '조쭝니' },
          { id: 'p3', name: '김철수' },
        ],
        cannot: [{ id: 'p4', name: '박영희' }],
      },
      {
        date: '2026-02-22',
        can: [
          { id: 'p1', name: '예딘공쥬' },
          { id: 'p2', name: '조쭝니' },
          { id: 'p3', name: '김철수' },
        ],
        cannot: [{ id: 'p4', name: '박영희' }],
      },
      {
        date: '2026-02-25',
        can: [{ id: 'p2', name: '조쭝니' }],
        cannot: [
          { id: 'p1', name: '예딘공쥬' },
          { id: 'p3', name: '김철수' },
          { id: 'p4', name: '박영희' },
        ],
      },
    ],
  },
};
