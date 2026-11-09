import { z } from 'zod';

// ==================== Zod Schemas ====================

/**
 * 대시보드 요약 스키마
 */
export const meetingDashboardSummaryDto = z.object({
  votingCount: z.number(),
  confirmedCount: z.number(),
});

/**
 * 대시보드 모임 카드 스키마
 */
export const meetingDashboardCardDto = z.object({
  meetingId: z.string(),
  title: z.string(),
  status: z.enum(['VOTING', 'CLOSED', 'CONFIRMED']),
  leadingDate: z.string().nullable(),
  finalizedDate: z.string().nullable(),
  completedVoteCount: z.number(),
  totalVoteCount: z.number(),
  memo: z.string().nullable().optional(),
});

/**
 * 진행중 모임 대시보드 응답 스키마
 */
export const inProgressDashboardResponseDto = z.object({
  hostName: z.string(),
  summary: meetingDashboardSummaryDto,
  meetings: z.array(meetingDashboardCardDto),
});

/**
 * 확정 모임 대시보드 응답 스키마
 */
export const confirmedDashboardResponseDto = z.object({
  hostName: z.string(),
  summary: meetingDashboardSummaryDto,
  meetings: z.array(meetingDashboardCardDto),
});

// ==================== TypeScript Types ====================

export type MeetingDashboardSummary = z.infer<
  typeof meetingDashboardSummaryDto
>;
export type MeetingDashboardCard = z.infer<typeof meetingDashboardCardDto>;
export type InProgressDashboardResponse = z.infer<
  typeof inProgressDashboardResponseDto
>;
export type ConfirmedDashboardResponse = z.infer<
  typeof confirmedDashboardResponseDto
>;
