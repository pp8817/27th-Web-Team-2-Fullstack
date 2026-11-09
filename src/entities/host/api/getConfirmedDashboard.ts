import { api } from '@/shared/api/client';
import { validateSchema } from '@/shared/api/validate';

import {
  type ConfirmedDashboardResponse,
  confirmedDashboardResponseDto,
} from '../dto/dashboard.dto';

/**
 * 호스트 확정 모임 대시보드 조회 API
 *
 * @returns 확정 모임 목록 및 요약 정보 (스키마 검증 완료)
 */
export async function getConfirmedDashboard(
  signal?: AbortSignal,
): Promise<ConfirmedDashboardResponse> {
  const ENDPOINT = 'v1/host/meeting/dashboard/confirmed';

  const rawResponse = await api.get(ENDPOINT, { signal }).json<unknown>();

  return validateSchema({
    dto: rawResponse,
    schema: confirmedDashboardResponseDto,
    schemaName: ENDPOINT,
  });
}
