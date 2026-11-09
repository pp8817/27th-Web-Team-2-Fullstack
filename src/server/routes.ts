// 웨딘 화면에서 사용하는 v1 API와 입력 스키마를 연결한다.
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { finalizeMeetingRequestDto } from '@/entities/host/dto/finalize.dto';
import { updateMeetRequestDto } from '@/entities/host/dto/host.dto';
import { createMeetRequestDto } from '@/entities/meeting/dto/meet.dto';
import { voteRequestDto } from '@/entities/meeting/dto/vote.dto';

import { beginOAuth, completeOAuth, socialAccounts } from './auth/oauth';
import {
  logout,
  requireUser,
  rotateSession,
  setSessionCookies,
} from './auth/session';
import { addCalendarEvent } from './calendar';
import {
  ApiError,
  body,
  date,
  json,
  meetingId,
  parse,
  participantName,
} from './http';
import {
  createMeeting,
  dashboard,
  finalizeMeeting,
  finalizePreview,
  participantExists,
  readHostMeeting,
  readPublicMeeting,
  saveMemo,
  saveVote,
  updateMeeting,
} from './meeting/service';

const title = z.string().trim().min(1).max(255);
const dates = z.array(date).min(1).max(500);
const capacity = z.int().min(1).max(2147483647).optional();
const createInput = createMeetRequestDto.extend({
  title,
  hostName: participantName,
  dates,
  maxParticipantCount: capacity,
});
const updateInput = updateMeetRequestDto.extend({
  meetingId,
  title,
  dates,
  maxParticipantCount: capacity,
  removedParticipantNames: z.array(participantName).max(500),
});
const voteInput = voteRequestDto.extend({
  meetingId,
  name: participantName,
  voteDates: z.array(date).max(500),
});
const finalizeInput = finalizeMeetingRequestDto.extend({
  meetingId,
  finalizedDate: date.optional(),
});
const memoInput = z.object({ meetingId, memo: z.string().max(200) });
const calendarInput = z.object({
  meetId: meetingId,
  eventDate: date,
  title: z.string().trim().min(1).max(50),
});

function queryId(request: NextRequest) {
  return parse(meetingId, request.nextUrl.searchParams.get('meetId'));
}

async function userId(request: NextRequest) {
  return (await requireUser(request)).id;
}

const routes: Record<
  string,
  (request: NextRequest) => Promise<Response> | Response
> = {
  'GET health': () => json({ ok: true }),
  'GET meeting': async (request) =>
    json(await readPublicMeeting(queryId(request))),
  'POST meeting': async (request) =>
    json(
      await createMeeting(
        await body(request, createInput),
        await userId(request),
      ),
    ),
  'GET meeting/participant/exist': async (request) =>
    json(
      await participantExists(
        queryId(request),
        parse(participantName, request.nextUrl.searchParams.get('name')),
      ),
    ),
  'POST meeting/vote': async (request) =>
    json(await saveVote(await body(request, voteInput), 'create')),
  'PUT meeting/vote': async (request) =>
    json(await saveVote(await body(request, voteInput), 'update')),
  'GET host/meeting': async (request) =>
    json(await readHostMeeting(queryId(request), await userId(request))),
  'PUT host/meeting': async (request) =>
    json(
      await updateMeeting(
        await body(request, updateInput),
        await userId(request),
      ),
    ),
  'PUT host/meeting/memo': async (request) => {
    const input = await body(request, memoInput);
    return json(
      await saveMemo(input.meetingId, await userId(request), input.memo),
    );
  },
  'GET host/meeting/dashboard/in-progress': async (request) =>
    json(await dashboard(await userId(request), 'VOTING')),
  'GET host/meeting/dashboard/confirmed': async (request) =>
    json(await dashboard(await userId(request), 'CONFIRMED')),
  'GET host/meeting/finalize/preview': async (request) =>
    json(await finalizePreview(queryId(request), await userId(request))),
  'POST host/meeting/finalize': async (request) => {
    const input = await body(request, finalizeInput);
    return json(
      await finalizeMeeting(
        input.meetingId,
        await userId(request),
        input.finalizedDate,
      ),
    );
  },
  'GET users/me': async (request) => {
    const user = await requireUser(request);
    return json({ id: Number(user.id), name: user.name ?? '' });
  },
  'GET auth/oauth/google/start': (request) => beginOAuth(request, 'google'),
  'GET auth/oauth/kakao/start': (request) => beginOAuth(request, 'kakao'),
  'GET auth/oauth/google': (request) => completeOAuth(request, 'google'),
  'GET auth/oauth/kakao': (request) => completeOAuth(request, 'kakao'),
  'GET auth/me/social-accounts': async (request) =>
    json(await socialAccounts(await userId(request))),
  'POST auth/refresh-cookie': async (request) => {
    const response = json({ success: true, message: '토큰을 갱신했습니다.' });
    setSessionCookies(request, response, await rotateSession(request));
    return response;
  },
  'POST auth/logout': (request) => logout(request, json({ success: true })),
  'POST calendar/kakao/events': async (request) => {
    const input = await body(request, calendarInput);
    return json(
      await addCalendarEvent(
        await userId(request),
        input.meetId,
        input.eventDate,
        input.title,
      ),
    );
  },
};

export async function dispatch(request: NextRequest, path: string[]) {
  if (
    request.method !== 'GET' &&
    ['cross-site', 'same-site'].includes(
      request.headers.get('sec-fetch-site') ?? '',
    )
  ) {
    throw new ApiError(403, '허용되지 않은 요청입니다.');
  }
  const route = routes[`${request.method} ${path.join('/')}`];
  if (!route) throw new ApiError(404, '요청한 API가 없습니다.');
  return route(request);
}
