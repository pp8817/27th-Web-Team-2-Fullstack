'use client';

import { useCallback } from 'react';

import { trackEvent } from '@/shared/lib/amplitude';
import { useKakao } from '@/shared/providers/KakaoProvider';

import type { WeddingEventInfo } from './types';

interface UseShareToFriendsOptions {
  eventInfo: WeddingEventInfo;
  shareUrl: string;
  imageUrl?: string;
}

export function useShareToFriends({
  eventInfo,
  shareUrl,
  imageUrl,
}: UseShareToFriendsOptions) {
  const { isReady } = useKakao();

  const handleShare = useCallback(() => {
    if (!isReady || !window.Kakao) return;

    trackEvent('calendar_share_click');

    const description = eventInfo.location
      ? `${eventInfo.location.name}에서 열리는 결혼식에 초대합니다`
      : '결혼식에 초대합니다';

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: eventInfo.title,
        description,
        ...(imageUrl && { imageUrl }),
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '일정 등록하기',
          link: {
            mobileWebUrl: `${shareUrl}?action=add_calendar`,
            webUrl: `${shareUrl}?action=add_calendar`,
          },
        },
      ],
    });
  }, [isReady, eventInfo, shareUrl, imageUrl]);

  return { handleShare, isReady };
}
