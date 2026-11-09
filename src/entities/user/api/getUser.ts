import { api } from '@/shared/api/client';
import { validateSchema } from '@/shared/api/validate';

import { type User, userDto } from '../dto/user.dto';

/**
 * 내 정보 조회 API
 *
 * @returns 인증된 사용자의 정보
 */
export async function getUser(): Promise<User> {
  const ENDPOINT = 'v1/users/me';

  const rawResponse = await api.get(ENDPOINT).json<unknown>();

  return validateSchema({
    dto: rawResponse,
    schema: userDto,
    schemaName: ENDPOINT,
  });
}
