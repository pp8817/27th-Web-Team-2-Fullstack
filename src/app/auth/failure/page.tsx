'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthFailureContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const message = searchParams.get('message');
  const code = searchParams.get('code');

  return (
    <div className='flex flex-col items-center space-y-4 text-center'>
      <h1 className='text-headline-6 text-text-primary'>
        로그인에 실패했습니다
      </h1>
      <p className='text-body-4 text-text-secondary'>
        소셜 로그인 중 오류가 발생했습니다.
        <br />
        다시 시도해주세요.
      </p>

      {(error || errorDescription || message || code) && (
        <div className='mt-4 w-full rounded bg-red-50 p-4 text-left text-sm text-red-600'>
          <p className='mb-2 font-bold'>서버 에러 상세 정보:</p>
          {error && (
            <p>
              <strong>Error:</strong> {error}
            </p>
          )}
          {errorDescription && (
            <p>
              <strong>Description:</strong> {errorDescription}
            </p>
          )}
          {message && (
            <p>
              <strong>Message:</strong> {message}
            </p>
          )}
          {code && (
            <p>
              <strong>Code:</strong> {code}
            </p>
          )}
          <p className='mt-2 text-xs break-all text-gray-500'>
            전체 파라미터: {searchParams.toString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default function AuthFailurePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center px-5 py-8'>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthFailureContent />
      </Suspense>

      <div className='mt-8 w-full space-y-3'>
        <Link
          href='/'
          className='text-body-2 bg-primary-default text-text-inverse flex h-14 w-full items-center justify-center rounded-lg active:scale-[0.98]'
        >
          홈으로 가기
        </Link>
        <Link
          href='/'
          className='text-body-4 text-text-secondary border-line-clickable flex h-12 w-full items-center justify-center rounded-lg border bg-white active:scale-[0.98]'
        >
          로그인 다시 시도하기
        </Link>
      </div>
    </main>
  );
}
