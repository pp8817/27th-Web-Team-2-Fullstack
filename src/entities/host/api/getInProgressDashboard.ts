import { api } from '@/shared/api/client';
import { validateSchema } from '@/shared/api/validate';

import {
  type InProgressDashboardResponse,
  inProgressDashboardResponseDto,
} from '../dto/dashboard.dto';

/**
 * 호스트 진행중 모임 대시보드 조회 API
 *
 * @returns 진행중 모임 목록 및 요약 정보 (스키마 검증 완료)
 */
export async function getInProgressDashboard(): Promise<InProgressDashboardResponse> {
  const ENDPOINT = 'v1/host/meeting/dashboard/in-progress';

  const rawResponse = await api.get(ENDPOINT).json<unknown>();

  return validateSchema({
    dto: rawResponse,
    schema: inProgressDashboardResponseDto,
    schemaName: ENDPOINT,
  });
}
