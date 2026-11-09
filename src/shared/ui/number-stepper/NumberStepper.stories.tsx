import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import NumberStepper from './NumberStepper';

const meta = {
  title: 'Shared/UI/NumberStepper',
  component: NumberStepper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
  argTypes: {
    onChange: { action: 'changed', description: '값 변경 콜백' },
    max: { control: 'number', description: '최대값 제한' },
  },
} satisfies Meta<typeof NumberStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 상태 (초기값 1)
export const Default: Story = {
  args: {},
};

// 최소값(1) 상태 — minus 버튼 비활성
export const MinValue: Story = {
  args: {},
  name: 'MinValue (초기 상태)',
};

// 최대값 제한 (max=10)
export const WithMaxLimit: Story = {
  args: {
    max: 10,
  },
  name: 'WithMaxLimit (max=10)',
};
