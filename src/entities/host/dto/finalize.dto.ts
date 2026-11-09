import { z } from 'zod';

// ==================== Zod Schemas ====================

/**
 * 일정 확정 요청 스키마
 */
export const finalizeMeetingRequestDto = z.object({
  meetingId: z.string(),
  finalizedDate: z.string().optional(),
});

/**
 * 일정 확정 응답 스키마
 */
export const finalizeMeetingResponseDto = z.object({
  status: z.enum(['VOTING', 'CLOSED', 'CONFIRMED']),
  finalizedDate: z.string(),
});

/**
 * 확정 후보 날짜별 투표 상세 스키마
 */
export const finalizeDateVoteDetailDto = z.object({
  date: z.string(),
  voteCount: z.number(),
  voterNames: z.array(z.string()),
});

/**
 * 일정 확정 미리보기 응답 스키마
 */
export const finalizeMeetingPreviewResponseDto = z.object({
  meetingId: z.string(),
  meetingTitle: z.string(),
  topDateVoteDetails: z.array(finalizeDateVoteDetailDto),
  requiresDateSelection: z.boolean(),
});

// ==================== TypeScript Types ====================

export type FinalizeMeetingRequest = z.infer<typeof finalizeMeetingRequestDto>;
export type FinalizeMeetingResponse = z.infer<
  typeof finalizeMeetingResponseDto
>;
export type FinalizeDateVoteDetail = z.infer<typeof finalizeDateVoteDetailDto>;
export type FinalizeMeetingPreviewResponse = z.infer<
  typeof finalizeMeetingPreviewResponseDto
>;
