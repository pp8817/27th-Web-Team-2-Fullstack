// 기존 웨딘 PostgreSQL 스키마에서 모임과 투표를 읽고 잠근다.
import type { Pool, PoolClient } from 'pg';

import type { MeetResponse } from '@/entities/meeting/dto/meet.dto';
import { db } from '@/server/db';
import { ApiError } from '@/server/http';

export type Meeting = MeetResponse & {
  hostUserId: string | null;
  memo: string | null;
};

const meetingSelect = `
  SELECT m.meet_id AS id, m.title, m.host_name AS "hostName",
    m.host_user_id AS "hostUserId", m.status, m.memo,
    m.max_participant_count AS "maxParticipantCount",
    to_char(m.finalized_date, 'YYYY-MM-DD') AS "finalizedDate",
    ARRAY(SELECT to_char(d.available_date, 'YYYY-MM-DD') FROM meeting_dates d
      WHERE d.meet_id = m.meet_id ORDER BY d.available_date) AS dates,
    COALESCE((SELECT jsonb_agg(jsonb_build_object(
      'id', p.participant_id, 'name', p.name, 'hasVoted', p.has_voted,
      'voteDates', ARRAY(SELECT to_char(v.vote_date, 'YYYY-MM-DD')
        FROM participant_vote_dates v WHERE v.participant_id = p.participant_id
        ORDER BY v.vote_date)
    ) ORDER BY p.updated_at DESC, p.participant_id DESC)
      FROM participants p WHERE p.meet_id = m.meet_id), '[]'::jsonb) AS participants
  FROM meetings m
`;

export async function findMeeting(
  id: string,
  client: Pool | PoolClient = db(),
) {
  const result = await client.query<Meeting>(
    `${meetingSelect} WHERE m.meet_id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function findHostMeetings(userId: string) {
  const result = await db().query<Meeting>(
    `${meetingSelect} WHERE m.host_user_id = $1 ORDER BY m.created_at DESC, m.meet_id`,
    [userId],
  );
  return result.rows;
}

export async function lockMeeting(client: PoolClient, id: string) {
  await client.query(
    'SELECT meet_id FROM meetings WHERE meet_id = $1 FOR UPDATE',
    [id],
  );
  return requireMeeting(await findMeeting(id, client));
}

export function requireMeeting(meeting: Meeting | null): Meeting {
  if (!meeting) {
    throw new ApiError(404, '모임을 찾을 수 없습니다.');
  }
  return meeting;
}

export function requireOwner(meeting: Meeting, userId: string) {
  if (meeting.hostUserId !== userId) {
    throw new ApiError(403, '모임 주최자만 요청할 수 있습니다.');
  }
  return meeting;
}

export function publicMeeting(meeting: Meeting): MeetResponse {
  const { hostUserId, memo, ...publicFields } = meeting;
  void hostUserId;
  void memo;
  return publicFields;
}
