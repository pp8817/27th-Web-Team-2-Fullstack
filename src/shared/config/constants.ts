export const SITE_TITLE = 'weddin | 청첩장 모임 일정 관리를 가장 쉽고 빠르게';
export const SITE_DESCRIPTION =
  '웨딘으로 청첩장 모임 일정을 쉽고 빠르게 관리해보세요';
export const OG_IMAGE = '/opengraph-image.png';

export const WEEKS = ['일', '월', '화', '수', '목', '금', '토'];

// 주최자 모드에서 날짜 선택 가능한 최대 범위 (다음해 2월까지)
export const HOST_RANGE_LIMIT_MONTH = 2; // 0-indexed (2 = March? No, 1 is Feb. Let's use logic for next year Feb)
// Actually logic will be handle in component: Current Year Dec + Next Year Jan, Feb.

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const DOMAIN_TARGET_MAP = {
  list: 'list',
  mypage: 'mypage',
  create: 'create',
} as const;
