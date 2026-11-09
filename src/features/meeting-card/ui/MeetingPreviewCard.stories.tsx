import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import MeetingPreviewCard from './MeetingPreviewCard';

const meta: Meta<typeof MeetingPreviewCard> = {
  title: 'Features/MeetingPreviewCard',
  component: MeetingPreviewCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MeetingPreviewCard>;

export const Default: Story = {
  args: {
    meeting: {
      id: 'card1',
      title: '관악구 쩝쩝박사 모임',
      dDay: 3,
      currentVotes: 4,
      totalVotes: 6,
      topDate: '2월 18일 토요일',
    },
  },
};

export const ZeroVotes: Story = {
  args: {
    meeting: {
      id: 'card2',
      title: '새로운 모임',
      dDay: 10,
      currentVotes: 0,
      totalVotes: 5,
      topDate: '미정',
    },
  },
};
