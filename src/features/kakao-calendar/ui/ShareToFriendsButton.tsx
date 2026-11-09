'use client';

import Button from '@/shared/ui/button/Button';
import Icon from '@/shared/ui/icon/Icon';

import type { WeddingEventInfo } from '../model/types';
import { useShareToFriends } from '../model/useShareToFriends';

interface ShareToFriendsButtonProps {
  eventInfo: WeddingEventInfo;
  shareUrl: string;
  imageUrl?: string;
}

export default function ShareToFriendsButton({
  eventInfo,
  shareUrl,
  imageUrl,
}: ShareToFriendsButtonProps) {
  const { handleShare, isReady } = useShareToFriends({
    eventInfo,
    shareUrl,
    imageUrl,
  });

  return (
    <Button
      onClick={handleShare}
      disabled={!isReady}
      variant='primary'
      fullWidth
    >
      <span className='flex items-center justify-center gap-2'>
        <Icon name='ic_other_share' size={20} />
        친구들에게 공유하기
      </span>
    </Button>
  );
}
