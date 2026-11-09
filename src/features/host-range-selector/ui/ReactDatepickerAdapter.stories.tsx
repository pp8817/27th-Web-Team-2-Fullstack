import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { addDays } from 'date-fns';
import { useState } from 'react';

import Calendar from '@/shared/ui/calendar/Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Features/HostRangeSelector',
  component: Calendar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='mx-auto w-full max-w-screen-sm bg-white'>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

const today = new Date();

/** 기본 상태 - 날짜를 드래그하여 선택 가능 */
export const Default: Story = {
  render: function Render() {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    return (
      <Calendar selectedDates={selectedDates} onChange={setSelectedDates} />
    );
  },
};

/** 일부 날짜가 미리 선택된 상태 */
export const WithPreselected: Story = {
  render: function Render() {
    const [selectedDates, setSelectedDates] = useState<Date[]>([
      addDays(today, 2),
      addDays(today, 3),
      addDays(today, 4),
      addDays(today, 7),
      addDays(today, 8),
    ]);
    return (
      <Calendar selectedDates={selectedDates} onChange={setSelectedDates} />
    );
  },
};

/** 특정 날짜만 선택 가능하도록 제한 */
export const WithAvailableDates: Story = {
  render: function Render() {
    const availableDates = Array.from({ length: 14 }, (_, i) =>
      addDays(today, i + 1),
    );
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    return (
      <Calendar
        selectedDates={selectedDates}
        onChange={setSelectedDates}
        availableDates={availableDates}
      />
    );
  },
};

/** 다음 달 투표 안내 툴팁 표시 */
export const WithTooltip: Story = {
  render: function Render() {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    return (
      <Calendar
        selectedDates={selectedDates}
        onChange={setSelectedDates}
        showNextMonthTooltip
      />
    );
  },
};
