import { z } from 'zod';

import { meetResponseDto } from '@/entities/meeting/dto/meet.dto';

// ==================== Zod Schemas ====================

/**
 * 모임 수정 요청 스키마
 */
export const updateMeetRequestDto = z.object({
  meetingId: z.string(),
  title: z.string().min(1),
  maxParticipantCount: z.number().optional(),
  dates: z.array(z.string()).min(1),
  removedParticipantNames: z.array(z.string()),
});

/**
 * 모임 수정 응답 스키마
 */
export const updateMeetResponseDto = z.object({
  meetingId: z.string(),
  title: z.string(),
  maxParticipantCount: z.number().optional(),
  dates: z.array(z.string()),
  participantCount: z.number(),
});

/**
 * 주최자용 모임 상세 조회 응답 스키마
 */
export const hostMeetingResponseDto = meetResponseDto
  .extend({
    notVotedParticipantCount: z.number().optional(),
    memo: z.string().nullable().optional(),
  })
  .passthrough();

// ==================== TypeScript Types ====================

export type UpdateMeetRequest = z.infer<typeof updateMeetRequestDto>;
export type UpdateMeetResponse = z.infer<typeof updateMeetResponseDto>;
export type HostMeetingResponse = z.infer<typeof hostMeetingResponseDto>;
