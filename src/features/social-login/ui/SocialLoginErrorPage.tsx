import Link from 'next/link';

export default function SocialLoginErrorPage() {
  return (
    <main className='flex min-h-screen flex-col px-5 pt-12 pb-8'>
      <section className='space-y-2'>
        <h1 className='text-headline-6 text-text-primary'>인증 오류</h1>
        <p className='text-body-4 text-text-secondary'>
          인증이 만료되었거나 유효하지 않아요. 다시 로그인해 주세요.
        </p>
      </section>

      <section className='mt-8 space-y-3'>
        <Link
          href='/test/login'
          className='text-body-2 bg-primary-default text-text-inverse flex h-12 w-full items-center justify-center rounded-lg active:scale-[0.98]'
        >
          로그인 화면으로 이동
        </Link>

        <Link
          href='/test/login/result'
          className='text-body-4 text-text-secondary border-line-clickable flex h-12 w-full items-center justify-center rounded-lg border bg-white active:scale-[0.98]'
        >
          로그인 결과 페이지로 이동
        </Link>
      </section>
    </main>
  );
}
