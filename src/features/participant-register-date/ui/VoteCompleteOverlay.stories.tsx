import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import VoteCompleteOverlay from './VoteCompleteOverlay';

const meta: Meta<typeof VoteCompleteOverlay> = {
  title: 'Features/ParticipantRegisterDate/VoteCompleteOverlay',
  component: VoteCompleteOverlay,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='relative mx-auto h-160 w-full max-w-[375px] bg-white'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VoteCompleteOverlay>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: '투표가 완료되었어요!',
    subtitle: '일정이 확정되면 조쭝니님이 알려드릴 거에요',
    onConfirm: () => alert('Confirm clicked'),
  },
};
