import { api } from '@/shared/api/client';

import type {
  CreateEventResponse,
  KakaoCalendarEventRequest,
} from '../model/types';

export async function createCalendarEvent(
  request: KakaoCalendarEventRequest,
): Promise<CreateEventResponse> {
  return api
    .post('v1/calendar/kakao/events', { json: request })
    .json<CreateEventResponse>();
}
