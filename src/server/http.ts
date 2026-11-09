// API 입력 검증과 공통 오류 응답을 처리한다.
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const noStore = { 'Cache-Control': 'no-store' };

export const meetingId = z
  .string()
  .min(1)
  .max(16)
  .regex(/^[\w-]+$/);
export const date = z.iso.date();
export const participantName = z.string().trim().min(1).max(100);

export function parse<T>(schema: z.ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new ApiError(400, '요청 값을 확인해 주세요.');
  }
  return parsed.data;
}

export async function body<T>(request: NextRequest, schema: z.ZodType<T>) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    throw new ApiError(415, 'JSON 요청이 필요합니다.');
  }
  const text = await request.text();
  if (text.length > 64 * 1024) {
    throw new ApiError(413, '요청이 너무 큽니다.');
  }
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new ApiError(400, 'JSON 요청 형식을 확인해 주세요.');
  }
  return parse(schema, value);
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: noStore });
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return json({ message: error.message }, error.status);
  }

  console.error('Weddin API failed', error instanceof Error ? error.name : '');
  return json({ message: '요청을 처리하지 못했습니다.' }, 500);
}
