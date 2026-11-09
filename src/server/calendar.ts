// 확정된 모임 날짜를 사용자의 카카오 톡캘린더에 추가한다.
import { z } from 'zod';

import { saveKakaoToken } from './auth/oauth';
import { providerToken } from './auth/providers';
import { db, transaction } from './db';
import { ApiError } from './http';
import { findMeeting, requireMeeting } from './meeting/repository';

type KakaoToken = { access_token: string; refresh_token: string | null };

async function calendarRequest(accessToken: string, event: URLSearchParams) {
  return fetch('https://kapi.kakao.com/v2/api/calendar/create/event', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: event,
    signal: AbortSignal.timeout(8000),
  });
}

export async function addCalendarEvent(
  userId: string,
  id: string,
  date: string,
  title: string,
) {
  const meeting = requireMeeting(await findMeeting(id));
  if (meeting.hostUserId !== userId)
    throw new ApiError(403, '모임 주최자만 요청할 수 있습니다.');
  if (meeting.status !== 'CONFIRMED' || meeting.finalizedDate !== date) {
    throw new ApiError(400, '모임의 확정 날짜를 확인해 주세요.');
  }

  const tokenQuery =
    "SELECT access_token, refresh_token FROM social_oauth_tokens WHERE user_id = $1 AND provider = 'KAKAO'";
  const token = (await db().query<KakaoToken>(tokenQuery, [userId])).rows[0];
  if (!token)
    throw new ApiError(404, '카카오 로그인 또는 계정 연동이 필요합니다.');

  const start = new Date(`${date}T00:00:00Z`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const event = new URLSearchParams({
    event: JSON.stringify({
      title,
      time: {
        all_day: true,
        start_at: start.toISOString(),
        end_at: end.toISOString(),
      },
    }),
  });

  let response = await calendarRequest(token.access_token, event);
  if (response.status === 401) {
    const accessToken = await transaction(async (client) => {
      const current = (
        await client.query<KakaoToken>(`${tokenQuery} FOR UPDATE`, [userId])
      ).rows[0];
      if (current?.access_token !== token.access_token && current)
        return current.access_token;
      if (!current?.refresh_token)
        throw new ApiError(400, '카카오에 다시 로그인해 주세요.');
      const refreshed = await providerToken('kakao', {
        grant_type: 'refresh_token',
        refresh_token: current.refresh_token,
      });
      await saveKakaoToken(client, userId, refreshed);
      return refreshed.access_token;
    });
    response = await calendarRequest(accessToken, event);
  }

  if (!response.ok)
    throw new ApiError(502, '카카오 캘린더에 일정을 추가하지 못했습니다.');
  const result = z
    .object({ event_id: z.string() })
    .parse(await response.json());
  return { eventId: result.event_id };
}
