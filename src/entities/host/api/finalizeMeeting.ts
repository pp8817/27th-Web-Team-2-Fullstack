import { api } from '@/shared/api/client';
import { validateSchema } from '@/shared/api/validate';

import {
  type FinalizeMeetingRequest,
  finalizeMeetingRequestDto,
  type FinalizeMeetingResponse,
  finalizeMeetingResponseDto,
} from '../dto/finalize.dto';

/**
 * 일정 확정 API
 *
 * 모임의 최종 날짜를 확정합니다.
 * 동점인 경우 finalizedDate를 지정해야 합니다.
 *
 * @param data 확정 요청 데이터
 * @returns 확정된 상태와 날짜 (스키마 검증 완료)
 */
export async function finalizeMeeting(
  data: FinalizeMeetingRequest,
): Promise<FinalizeMeetingResponse> {
  const ENDPOINT = 'v1/host/meeting/finalize';

  const json = finalizeMeetingRequestDto.parse(data);

  const rawResponse = await api.post(ENDPOINT, { json }).json<unknown>();

  return validateSchema({
    dto: rawResponse,
    schema: finalizeMeetingResponseDto,
    schemaName: ENDPOINT,
  });
}
