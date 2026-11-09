// 카카오 공유(useShareToFriends)에서 사용
export interface WeddingEventInfo {
  title: string;
  startAt: string;
  endAt: string;
  timeZone: string;
  allDay?: boolean;
  description?: string;
  location?: {
    name: string;
    address: string;
  };
  reminderMinutes?: number[];
}

// 백엔드 POST /api/v1/calendar/kakao/events 요청 스펙
export interface KakaoCalendarEventRequest {
  meetId: string;
  eventDate: string; // 'yyyy-MM-dd'
  title: string;
}

export interface CreateEventResponse {
  eventId: string;
}
