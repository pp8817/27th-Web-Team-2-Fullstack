import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MOCK_CONFIRMED_MEETINGS } from '../model/mock-data';
import MeetingCalendar from './MeetingCalendar';

const meta: Meta<typeof MeetingCalendar> = {
  title: 'Features/MeetingCalendar',
  component: MeetingCalendar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='mx-auto w-full max-w-screen-sm bg-white p-4'>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MeetingCalendar>;

/** 기본 - 여러 날짜에 모임이 있는 상태 */
export const Default: Story = {
  args: {
    meetings: MOCK_CONFIRMED_MEETINGS,
  },
};

/** 같은 날 복수 모임 - 2/13에 2개 모임 (스와이프 테스트) */
export const MultipleMeetingsSameDay: Story = {
  args: {
    meetings: MOCK_CONFIRMED_MEETINGS.filter((m) => m.date === '2026-02-13'),
  },
};

/** 단일 모임 */
export const SingleMeeting: Story = {
  args: {
    meetings: [MOCK_CONFIRMED_MEETINGS[2]],
  },
};

/** 빈 캘린더 */
export const Empty: Story = {
  args: {
    meetings: [],
  },
};
