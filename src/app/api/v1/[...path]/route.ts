// Next.js Route Handler에서 웨딘 API 요청을 전달한다.
import type { NextRequest } from 'next/server';

import { errorResponse } from '@/server/http';
import { dispatch } from '@/server/routes';

export const runtime = 'nodejs';

async function handle(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await context.params;
    return await dispatch(request, path);
  } catch (error) {
    return errorResponse(error);
  }
}

export { handle as GET, handle as POST, handle as PUT };
