// 웨딘의 날짜 투표, 주최자 편집, 일정 확정 규칙을 처리한다.
import { randomBytes } from 'node:crypto';

import type { PoolClient } from 'pg';

import type { UpdateMeetRequest } from '@/entities/host/dto/host.dto';
import type { CreateMeetRequest } from '@/entities/meeting/dto/meet.dto';
import type { VoteRequest } from '@/entities/meeting/dto/vote.dto';
import { transaction } from '@/server/db';
import { ApiError } from '@/server/http';

import {
  findHostMeetings,
  findMeeting,
  lockMeeting,
  type Meeting,
  publicMeeting,
  requireMeeting,
  requireOwner,
} from './repository';

export async function readPublicMeeting(id: string) {
  return publicMeeting(requireMeeting(await findMeeting(id)));
}

export async function readHostMeeting(id: string, userId: string) {
  const meeting = requireOwner(requireMeeting(await findMeeting(id)), userId);
  return {
    ...publicMeeting(meeting),
    memo: meeting.memo,
    notVotedParticipantCount: Math.max(
      0,
      (meeting.maxParticipantCount ?? meeting.participants.length) -
        meeting.participants.filter((person) => person.hasVoted).length,
    ),
  };
}

export async function createMeeting(input: CreateMeetRequest, userId: string) {
  const id = randomBytes(12).toString('base64url');
  return transaction(async (client) => {
    await client.query(
      `INSERT INTO meetings(meet_id, title, host_name, host_user_id, max_participant_count)
        VALUES ($1, $2, $3, $4, $5)`,
      [
        id,
        input.title,
        input.hostName,
        userId,
        input.maxParticipantCount ?? null,
      ],
    );
    await addDates(client, id, input.dates);
    return { id };
  });
}

async function addDates(client: PoolClient, id: string, dates: string[]) {
  await client.query(
    `INSERT INTO meeting_dates(meet_id, available_date)
      SELECT $1, date FROM unnest($2::date[]) AS date ON CONFLICT DO NOTHING`,
    [id, dates],
  );
}

function requireVoting(meeting: Meeting) {
  if (meeting.status !== 'VOTING') {
    throw new ApiError(409, '이미 투표가 종료된 모임입니다.');
  }
}

export async function updateMeeting(input: UpdateMeetRequest, userId: string) {
  return transaction(async (client) => {
    const id = input.meetingId;
    const meeting = requireOwner(await lockMeeting(client, id), userId);
    requireVoting(meeting);
    const dates = [...new Set(input.dates)].sort();
    const removed = new Set(input.removedParticipantNames);
    for (const name of removed) {
      const person = meeting.participants.find((item) => item.name === name);
      if (!person || person.hasVoted || name === meeting.hostName) {
        throw new ApiError(400, '삭제할 수 없는 참여자가 포함되어 있습니다.');
      }
    }
    const remaining = meeting.participants.filter(
      (person) => !removed.has(person.name),
    );
    if (
      remaining.some((person) =>
        person.voteDates.some((day) => !dates.includes(day)),
      )
    ) {
      throw new ApiError(400, '기존 투표와 충돌하는 날짜 변경입니다.');
    }
    if (
      input.maxParticipantCount !== undefined &&
      input.maxParticipantCount < remaining.length
    ) {
      throw new ApiError(
        400,
        '최대 참여 인원은 현재 참여자 수보다 작을 수 없습니다.',
      );
    }

    await client.query(
      'DELETE FROM participants WHERE meet_id = $1 AND name = ANY($2::text[])',
      [id, [...removed]],
    );
    await client.query(
      'DELETE FROM meeting_dates WHERE meet_id = $1 AND NOT (available_date = ANY($2::date[]))',
      [id, dates],
    );
    await addDates(client, id, dates);
    await client.query(
      'UPDATE meetings SET title = $2, max_participant_count = $3 WHERE meet_id = $1',
      [id, input.title, input.maxParticipantCount ?? null],
    );
    return {
      meetingId: id,
      title: input.title,
      dates,
      maxParticipantCount: input.maxParticipantCount,
      participantCount: remaining.length,
    };
  });
}

export async function saveMemo(id: string, userId: string, memo: string) {
  return transaction(async (client) => {
    requireOwner(await lockMeeting(client, id), userId);
    await client.query('UPDATE meetings SET memo = $2 WHERE meet_id = $1', [
      id,
      memo,
    ]);
    return { success: true };
  });
}

export async function participantExists(id: string, name: string) {
  const meeting = await findMeeting(id);
  return {
    isExist:
      meeting?.participants.some((p) => p.name === name && p.hasVoted) ?? false,
  };
}

export async function saveVote(input: VoteRequest, mode: 'create' | 'update') {
  return transaction(async (client) => {
    const meeting = await lockMeeting(client, input.meetingId);
    requireVoting(meeting);
    if (input.voteDates.some((day) => !meeting.dates.includes(day))) {
      throw new ApiError(400, '모임에서 선택 가능한 날짜가 아닙니다.');
    }
    const person = meeting.participants.find(
      (item) => item.name === input.name,
    );
    if (mode === 'create' && person?.hasVoted) {
      throw new ApiError(409, '이미 투표를 완료한 참여자입니다.');
    }
    if (mode === 'update' && !person) {
      throw new ApiError(404, '참여자를 찾을 수 없습니다.');
    }
    if (
      !person &&
      meeting.maxParticipantCount !== null &&
      meeting.participants.length >= meeting.maxParticipantCount
    ) {
      throw new ApiError(409, '최대 참여 인원을 초과할 수 없습니다.');
    }

    let participantId = person?.id;
    if (participantId === undefined) {
      const result = await client.query<{ id: string }>(
        `INSERT INTO participants(meet_id, name, has_voted) VALUES ($1, $2, true)
          RETURNING participant_id AS id`,
        [meeting.id, input.name],
      );
      participantId = Number(result.rows[0].id);
    } else {
      await client.query(
        'UPDATE participants SET has_voted = true WHERE participant_id = $1',
        [participantId],
      );
      await client.query(
        'DELETE FROM participant_vote_dates WHERE participant_id = $1',
        [participantId],
      );
    }
    await client.query(
      `INSERT INTO participant_vote_dates(participant_id, vote_date)
        SELECT $1, date FROM unnest($2::date[]) AS date ON CONFLICT DO NOTHING`,
      [participantId, input.voteDates],
    );
    return { success: true };
  });
}

function topDates(meeting: Meeting) {
  const votersByDate = new Map(
    meeting.dates.map((day) => [day, [] as string[]]),
  );
  for (const person of meeting.participants) {
    if (!person.hasVoted) continue;
    for (const day of person.voteDates) {
      votersByDate.get(day)?.push(person.name);
    }
  }
  const details = [...votersByDate].map(([date, names]) => ({
    date,
    voteCount: names.length,
    voterNames: names.sort(),
  }));
  const highest = Math.max(0, ...details.map((day) => day.voteCount));
  return details.filter((day) => day.voteCount === highest);
}

export async function dashboard(
  userId: string,
  status: 'VOTING' | 'CONFIRMED',
) {
  const meetings = await findHostMeetings(userId);
  const cards = meetings
    .filter((meeting) => meeting.status === status)
    .map((meeting) => {
      const completedVoteCount = meeting.participants.filter(
        (person) => person.hasVoted,
      ).length;
      return {
        meetingId: meeting.id,
        title: meeting.title,
        status: meeting.status,
        finalizedDate: meeting.finalizedDate,
        leadingDate: topDates(meeting)[0]?.date ?? null,
        completedVoteCount,
        totalVoteCount: Math.max(
          completedVoteCount,
          meeting.maxParticipantCount ?? meeting.participants.length,
        ),
        memo: meeting.memo,
      };
    });
  cards.sort((a, b) => {
    const dateA =
      (status === 'VOTING' ? a.leadingDate : a.finalizedDate) ?? '9999-12-31';
    const dateB =
      (status === 'VOTING' ? b.leadingDate : b.finalizedDate) ?? '9999-12-31';
    return dateA.localeCompare(dateB);
  });
  return {
    hostName: meetings.find((meeting) => meeting.hostName)?.hostName ?? '',
    summary: {
      votingCount: meetings.filter((meeting) => meeting.status === 'VOTING')
        .length,
      confirmedCount: meetings.filter(
        (meeting) => meeting.status === 'CONFIRMED',
      ).length,
    },
    meetings: cards,
  };
}

export async function finalizePreview(id: string, userId: string) {
  const meeting = requireOwner(requireMeeting(await findMeeting(id)), userId);
  if (meeting.status === 'CONFIRMED') {
    throw new ApiError(409, '이미 확정된 모임입니다.');
  }
  const details = topDates(meeting);
  return {
    meetingId: id,
    meetingTitle: meeting.title,
    topDateVoteDetails: details,
    requiresDateSelection: details.length > 1,
  };
}

export async function finalizeMeeting(
  id: string,
  userId: string,
  selectedDate?: string,
) {
  return transaction(async (client) => {
    const meeting = requireOwner(await lockMeeting(client, id), userId);
    if (meeting.status === 'CONFIRMED') {
      if (
        !meeting.finalizedDate ||
        (selectedDate && selectedDate !== meeting.finalizedDate)
      ) {
        throw new ApiError(409, '이미 확정된 모임입니다.');
      }
      return { status: meeting.status, finalizedDate: meeting.finalizedDate };
    }
    const leaders = topDates(meeting);
    const finalizedDate =
      selectedDate ?? (leaders.length === 1 ? leaders[0].date : undefined);
    if (!finalizedDate || !leaders.some((day) => day.date === finalizedDate)) {
      throw new ApiError(400, '최다 득표 날짜 중에서 확정일을 선택해 주세요.');
    }
    await client.query(
      "UPDATE meetings SET status = 'CONFIRMED', finalized_date = $2 WHERE meet_id = $1",
      [id, finalizedDate],
    );
    return { status: 'CONFIRMED', finalizedDate };
  });
}
