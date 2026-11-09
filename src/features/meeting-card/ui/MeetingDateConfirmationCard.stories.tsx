import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import MeetingDateConfirmationCard from './MeetingDateConfirmationCard';

const meta: Meta<typeof MeetingDateConfirmationCard> = {
  title: 'Features/MeetingDateConfirmationCard',
  component: MeetingDateConfirmationCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MeetingDateConfirmationCard>;

export const Default: Story = {
  args: {
    date: '12월 14일',
    rank: 1,
    attendeeCount: 6,
    attendees: ['냐옹', '냐옹', '냐옹', '냐옹'],
    isConfirmed: false,
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    date: '12월 14일',
    rank: 1,
    attendeeCount: 6,
    attendees: ['냐옹', '냐옹', '냐옹', '냐옹'],
    isConfirmed: true,
    isSelected: true,
  },
};
