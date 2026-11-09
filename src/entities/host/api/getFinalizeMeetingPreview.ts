import { api } from '@/shared/api/client';
import { validateSchema } from '@/shared/api/validate';

import {
  type FinalizeMeetingPreviewResponse,
  finalizeMeetingPreviewResponseDto,
} from '../dto/finalize.dto';

/**
 * 일정 확정 미리보기 API
 *
 * 투표 1위 후보 날짜와 투표자 정보를 조회합니다.
 *
 * @param meetId 모임 고유 ID
 * @returns 확정 후보 날짜 및 투표 상세 (스키마 검증 완료)
 */
export async function getFinalizeMeetingPreview(
  meetId: string,
  signal?: AbortSignal,
): Promise<FinalizeMeetingPreviewResponse> {
  const ENDPOINT = 'v1/host/meeting/finalize/preview';

  const rawResponse = await api
    .get(ENDPOINT, {
      searchParams: { meetId },
      signal,
    })
    .json<unknown>();

  return validateSchema({
    dto: rawResponse,
    schema: finalizeMeetingPreviewResponseDto,
    schemaName: ENDPOINT,
  });
}
