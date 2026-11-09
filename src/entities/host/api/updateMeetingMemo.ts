import { api } from '@/shared/api/client';

interface UpdateMeetingMemoParams {
  meetingId: string;
  memo: string;
}

/**
 * 주최자가 모임 메모를 저장합니다.
 *
 * @param params { meetingId: string; memo: string }
 * @returns 성공 여부 (빈 응답)
 */
export async function updateMeetingMemo(
  params: UpdateMeetingMemoParams,
): Promise<void> {
  const ENDPOINT = `v1/host/meeting/memo`;

  await api
    .put(ENDPOINT, {
      json: params,
    })
    .json<unknown>(); // Returns empty body typically
}
