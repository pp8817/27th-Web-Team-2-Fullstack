import { api } from '@/shared/api/client';
import { validateSchema } from '@/shared/api/validate';

import {
  type UpdateMeetRequest,
  type UpdateMeetResponse,
  updateMeetResponseDto,
} from '../dto/host.dto';

export async function updateMeeting(
  request: UpdateMeetRequest,
): Promise<UpdateMeetResponse> {
  const ENDPOINT = 'v1/host/meeting';

  const rawResponse = await api
    .put(ENDPOINT, { json: request })
    .json<unknown>();

  return validateSchema({
    dto: rawResponse,
    schema: updateMeetResponseDto,
    schemaName: ENDPOINT,
  });
}
