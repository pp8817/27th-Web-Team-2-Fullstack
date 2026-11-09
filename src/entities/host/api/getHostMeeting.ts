import { api } from '@/shared/api/client';
import { validateSchema } from '@/shared/api/validate';

import {
  type HostMeetingResponse,
  hostMeetingResponseDto,
} from '../dto/host.dto';

/**
 * 주최자용 모임 상세 조회 API
 *
 * @param meetId 모임 고유 ID
 * @returns 모임 정보, 참여자 투표 현황, 미투표 인원 수, 메모
 */
export async function getHostMeeting(
  meetId: string,
): Promise<HostMeetingResponse> {
  const ENDPOINT = `v1/host/meeting`;

  // 1) 실제 HTTP 요청 (query parameter로 meetId 전달)
  const rawResponse = await api
    .get(ENDPOINT, {
      searchParams: { meetId },
    })
    .json<unknown>();

  // 2) 응답 스키마 검증
  return validateSchema({
    dto: rawResponse,
    schema: hostMeetingResponseDto,
    schemaName: ENDPOINT,
  });
}
